const { data_tiang_r5, tagtiangbot_checklist_tiang_r5, tagtiangbot_checklist_tiang_r5_provider, allprovider, sequelize } = require('@models')
const { NotFound, Forbidden } = require('http-errors')
const { Op, Sequelize, QueryTypes } = require('sequelize')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const { format } = require('date-fns')
const { json } = require('body-parser')
const moment = require('moment-timezone')
// const sequelize = require('@models/index')
// console.log()
const odpPath = path.join(__dirname, '..', '..', 'tagging-tiang', 'assets', 'evidence', 'odp')
const odcbPath = path.join(__dirname, '..', '..', 'tagging-tiang', 'assets', 'evidence', 'odcb')
const polePath = path.join(__dirname, '..', '..', 'tagging-tiang', 'assets', 'evidence', 'pole')
const kudcPath = path.join(__dirname, '..', '..', 'tagging-tiang', 'assets', 'evidence', 'kudc')
const alproPath = path.join(__dirname, '..', '..', 'tagging-tiang', 'assets', 'evidence', 'alpro-competitor')

async function findPole(req, res, next) {
    const { lat, long } = req.body

    if (!lat || !long) {
        return res.status(400).json({ error: "Lat atau long tidak boleh kosong" });
    }

    let notCheck = await data_tiang_r5.findAll({
        attributes: [
            'id',
            'nomor_tiang',
            'lat',
            'longi',
            [
                Sequelize.literal(
                    `SQRT(POW(69.1 * (lat - "${lat}"), 2) + POW(69.1 * ("${long}" - longi) * COS(lat / 57.3), 2))`
                ),
                'distance',
            ],
            [Sequelize.literal('"uncheck"'), 'status']
        ],
        where: {
            [Op.and]: [{ witel: req.user.witel }, Sequelize.literal('NOT EXISTS (SELECT 1 FROM tagtiangbot_checklist_tiang_r5 WHERE tagtiangbot_checklist_tiang_r5.id = data_tiang_r5.id)')]

        },
        having: Sequelize.literal('distance < 0.0093205679'),
        order: [['distance', 'ASC']],
    })

    const checked = await tagtiangbot_checklist_tiang_r5.findAll({
        attributes: [
            'id',
            'nomor_tiang',
            ['lat_origin', 'lat'],
            ['longi_origin', 'longi'],
            [
                Sequelize.literal(
                    `SQRT(POW(69.1 * (lat_origin - "${lat}"), 2) + POW(69.1 * ("${long}" - longi_origin) * COS(lat_origin / 57.3), 2))`
                ),
                'distance',
            ],
            [Sequelize.literal('"checked"'), 'status']
        ],
        where: {
            witel: req.user.witel,
        },
        having: Sequelize.literal('distance < 0.0093205679'),
        order: [['distance', 'ASC']],
    })
    // const mergedResults = [...notCheck, ...checked];
    // console.log(checked.length)
    console.log(notCheck)
    const mergedResults = [...checked, ...notCheck]

    const mergedResultsInMeter = mergedResults.map(result => {
        const distanceInMeter = Math.round(parseFloat(result.dataValues.distance) * 1609.34 * 1000) / 1000;
        // console.log(result.dataValues.lat)
        return {
            id: result.id,
            nomor_tiang: result.nomor_tiang,
            lat: result.dataValues.lat,
            longi: result.dataValues.longi,
            distance: distanceInMeter,
            status: result.dataValues.status
        };
    });

    console.log(mergedResultsInMeter.length)


    res.status(200).json(mergedResultsInMeter)
}



async function tagging(req, res, next) {
    // console.log(req.body)
    let { idPole, KU, DC, address, ODP, ODCB, alproKompetitor, lat, long } = JSON.parse(req.body.data)

    // console.log(alproKompetitor.type)
    // console.log(req.body.data)
    // console.log(req.body['data'])
    // console.log(JSON.parse(req.body.data))
    // console.log(JSON.parse(req.body.data).DC)
    // console.log(DC)
    // console.log(JSON.parse(DC))
    // console.log(KU.length)

    let KUDC = []
    let condition_odcb
    let condition_odp
    let condition_alpro_competitor
    const uuid = req.user.witel + "-" + uuidv4().replace(/-/g, '').substring(0, 13).toUpperCase()
    const rev = await data_tiang_r5.findOne({ where: { id: idPole } })
    let kuQty = 0
    let dcQty = 0
    const img_name = `image_pole_${idPole}.jpg`

    if (!ODCB) {
        condition_odcb = `{"option":"TIDAK", "comment":"-", "photo":"-"}`
    } else {
        condition_odcb = `{"option":"YA", "comment":"${ODCB?.comment}", "photo":"/evidence/alpro-competitor/${idPole}/${img_name}"}`
    }

    if (!ODP) {
        condition_odp = `{"option":"TIDAK", "comment":"-", "photo":"-"}`
    } else {
        condition_odp = `{"option":"YA", "comment":"${ODP?.comment}", "photo":"/evidence/odp/${idPole}/${img_name}"}`
    }

    if (!alproKompetitor?.type) {
        condition_alpro_competitor = `{"option":"TIDAK", "comment":"-", "photo":"-"}`
    } else {
        condition_alpro_competitor = `{"option":"YA","type":"${alproKompetitor?.type}","prov":"${alproKompetitor?.prov}","comment":"${alproKompetitor?.comment}", "photo":"/evidence/alpro-competitor/${idPole}/${img_name}"}`
    }

    for (let i = 0; i < KU?.length; i++) {
        KUDC.push({
            tagtiangbot_checklist_uuid: uuid,
            tagtiangbot_provider_id: KU[i].provider,
            qty_cable: parseInt(KU[i].qty),
            type: 'KU'
        })
        kuQty += parseInt(KU[i].qty)
    }
    for (let i = 0; i < DC?.length; i++) {
        KUDC.push({
            tagtiangbot_checklist_uuid: uuid,
            tagtiangbot_provider_id: DC[i].provider,
            qty_cable: parseInt(DC[i].qty),
            type: 'DC'
        })
        dcQty += parseInt(DC[i].qty)
    }

    const tag = {
        witel: req.user.witel,
        sto: rev.sto,
        id: rev.id,
        nomor_tiang: rev.nomor_tiang,
        lat_origin: rev.lat,
        longi_origin: rev.longi,
        address,
        date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        users_id: req.user.id,
        uuid,
        from_id: req.user.id_telegram,
        evidence_pole: `/evidence/pole/${idPole}/${img_name}`,
        evidence_ku_dc: `/evidence/kudc/${idPole}/${img_name}`,
        qty_ku_cable: kuQty,
        qty_dc_cable: dcQty,
        condition_odp,
        condition_odcb,
        condition_alpro_competitor,
        lat_tagging: lat,
        longi_tagging: long
    }

    const check = await tagtiangbot_checklist_tiang_r5.findOne({ where: { id: idPole } })

    if (!check) {
        await tagtiangbot_checklist_tiang_r5.creat(tag)
            .then(async () => {
                await tagtiangbot_checklist_tiang_r5_provider.bulkCreate(KUDC, {
                    fields: ['tagtiangbot_checklist_uuid', 'tagtiangbot_provider_id', 'qty_cable', 'type']
                })
                    .then(async () => {
                        const kudcNewPath = path.join(kudcPath, idPole)
                        const poleNewPath = path.join(polePath, idPole)

                        if (!fs.existsSync(kudcNewPath)) {
                            await fs.mkdirSync(kudcNewPath)
                        }
                        if (!fs.existsSync(poleNewPath)) {
                            await fs.mkdirSync(poleNewPath)
                        }
                        await fs.writeFileSync(path.join(kudcNewPath, img_name), req.files['kudcImage'][0].buffer)
                        await fs.writeFileSync(path.join(poleNewPath, img_name), req.files['poleImage'][0].buffer)

                        if (alproKompetitor.type) {
                            const alproNewPath = path.join(alproPath, idPole)

                            if (!fs.existsSync(alproNewPath)) {
                                await fs.mkdirSync(alproNewPath)
                            }
                            await fs.writeFileSync(path.join(alproNewPath, img_name), req.files['alproImage'][0]?.buffer)
                        }
                        if (ODP) {
                            const odpNewPath = path.join(odpPath, idPole)

                            if (!fs.existsSync(odpNewPath)) {
                                await fs.mkdirSync(odpNewPath)
                            }
                            await fs.writeFileSync(path.join(odpNewPath, img_name), req.files['ODPImage'][0]?.buffer)
                        }
                        if (ODCB) {
                            const odcbNewPath = path.join(odcbPath, idPole)

                            if (!fs.existsSync(odcbNewPath)) {
                                await fs.mkdirSync(odcbNewPath)
                            }
                            await fs.writeFileSync(path.join(odcbNewPath, img_name), req.files['ODCBImage'][0]?.buffer)
                        }
                    })
                    .then(() => {
                        res.status(200).json({ message: `terima kasih ${req.user.name} teknisi witel ${req.user.witel}` })
                    })
                    .catch((err) => {
                        res.status(500)
                        console.log(err)
                    })
            })
            .catch((err) => {
                res.status(500)
                console.log(err)
            })
    } else {
        await tagtiangbot_checklist_tiang_r5_provider.destroy({ where: { tagtiangbot_checklist_uuid: check.uuid } })
            .then(async () => {
                await tagtiangbot_checklist_tiang_r5.update(tag, { where: { id: idPole } })
                    .then(async () => {
                        await tagtiangbot_checklist_tiang_r5_provider.bulkCreate(KUDC, {
                            fields: ['tagtiangbot_checklist_uuid', 'tagtiangbot_provider_id', 'qty_cable', 'type']
                        })
                            .then(async () => {
                                const kudcNewPath = path.join(kudcPath, idPole)
                                const poleNewPath = path.join(polePath, idPole)
                                // console.log(req.files)

                                if (!fs.existsSync(kudcNewPath)) {
                                    await fs.mkdirSync(kudcNewPath)
                                }
                                if (!fs.existsSync(poleNewPath)) {
                                    await fs.mkdirSync(poleNewPath)
                                }
                                await fs.writeFileSync(path.join(kudcNewPath, img_name), req.files['kudcImage'][0].buffer)
                                // console.log("ini jalan")
                                await fs.writeFileSync(path.join(poleNewPath, img_name), req.files['poleImage'][0].buffer)

                                if (alproKompetitor?.type) {
                                    const alproNewPath = path.join(alproPath, idPole)
                                    // console.log("ini jalan")
                                    if (!fs.existsSync(alproNewPath)) {
                                        await fs.mkdirSync(alproNewPath)
                                    }
                                    await fs.writeFileSync(path.join(alproNewPath, img_name), req.files['alproImage'][0]?.buffer)
                                    // console.log("ini jalan")
                                }
                                if (ODP) {
                                    const odpNewPath = path.join(odpPath, idPole)

                                    if (!fs.existsSync(odpNewPath)) {
                                        await fs.mkdirSync(odpNewPath)
                                    }
                                    await fs.writeFileSync(path.join(odpNewPath, img_name), req.files['ODPImage'][0]?.buffer)
                                }
                                if (ODCB) {
                                    const odcbNewPath = path.join(odcbPath, idPole)

                                    if (!fs.existsSync(odcbNewPath)) {
                                        await fs.mkdirSync(odcbNewPath)
                                    }
                                    await fs.writeFileSync(path.join(odcbNewPath, img_name), req.files['ODCBImage'][0]?.buffer)
                                }
                            })
                            .then(() => {
                                res.status(200).json({ message: `terima kasih ${req.user.name} teknisi witel ${req.user.witel}` })
                            })
                            .catch((err) => {
                                res.status(500)
                                console.log(err)
                            })
                    })
                    .catch((err) => {
                        res.status(500)
                        console.log(err)
                    })
            })
            .catch((err) => {
                res.status(500)
                console.log(err)
            })
    }
}

async function getProv(req, res, next) {
    const result = await allprovider.findAll()

    result
        ? res.status(200).json(result)
        : res.status(403).json('Data Provider Tidak Ditemukan')
}

async function getSTO(req, res, next) {
    const result = await sequelize.query(
        `SELECT STO FROM valoffo.MAPPING_HERO WHERE WITEL = :witel ORDER BY STO`,
        {
            replacements: { witel: req.user.witel },
            type: Sequelize.QueryTypes.SELECT
        }
    );

    result
        ? res.status(200).json(result)
        : res.status(403).json('Data STO Tidak Ditemukan')
}

async function generateNewId() {
    const result = await data_tiang_r5.findOne({
        attributes: [
            [
                Sequelize.literal("CONCAT('R5', SUBSTRING_INDEX(id, 'R5', -1)+1)"), 'newId'

            ]
        ],
        order: [['id', 'DESC']],
        raw: true
    })

    return result.newId
}

async function generateNewPole(witel, lat, long, sto, jenisTiang, address, id) {
    // const id = generateNewId()
    
    const time = await moment.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
    const lokasi = `POINT(${long} ${lat})`

    const data = {
        witel,
        sto,
        nomor_tiang: jenisTiang,
        lat,
        longi : long,
        id,
        lokasi,
        created_at: time,
        updated_at: time,
        address
    }

    console.log(data)

    try {
        await data_tiang_r5.create(data);
        return true;
    } catch (error) {
        console.error(error + "hehehe");
        return false;
    }
}

async function newPole(req, res) {
    const { lat, long, sto, jenisTiang, KU, DC, address, ODP, ODCB, alproKompetitor } = JSON.parse(req.body.data)
    const witel = req.user.witel
    const idPole = await generateNewId()
    // console.log(req.body)
    // console.log(idPole)
    // console.log(sto)

    await generateNewPole(witel, lat, long, sto, jenisTiang, address, idPole)
        .then(async () => {
            let KUDC = []
            let condition_odcb
            let condition_odp
            let condition_alpro_competitor
            const uuid = req.user.witel + "-" + uuidv4().replace(/-/g, '').substring(0, 13).toUpperCase()
            const rev = await data_tiang_r5.findOne({ where: { id: idPole } })
            let kuQty = 0
            let dcQty = 0
            const img_name = `image_pole_${idPole}.jpg`

            if (!ODCB) {
                condition_odcb = `{"option":"TIDAK", "comment":"-", "photo":"-"}`
            } else {
                condition_odcb = `{"option":"YA", "comment":"${ODCB?.comment}", "photo":"/evidence/alpro-competitor/${idPole}/${img_name}"}`
            }
        
            if (!ODP) {
                condition_odp = `{"option":"TIDAK", "comment":"-", "photo":"-"}`
            } else {
                condition_odp = `{"option":"YA", "comment":"${ODP?.comment}", "photo":"/evidence/odp/${idPole}/${img_name}"}`
            }
        
            if (!alproKompetitor?.type) {
                condition_alpro_competitor = `{"option":"TIDAK", "comment":"-", "photo":"-"}`
            } else {
                condition_alpro_competitor = `{"option":"YA","type":"${alproKompetitor?.type}","prov":"${alproKompetitor?.prov}","comment":"${alproKompetitor?.comment}", "photo":"/evidence/alpro-competitor/${idPole}/${img_name}"}`
            }
        
            for (let i = 0; i < KU?.length; i++) {
                KUDC.push({
                    tagtiangbot_checklist_uuid: uuid,
                    tagtiangbot_provider_id: KU[i].provider,
                    qty_cable: parseInt(KU[i].qty),
                    type: 'KU'
                })
                kuQty += parseInt(KU[i].qty)
            }
            for (let i = 0; i < DC?.length; i++) {
                KUDC.push({
                    tagtiangbot_checklist_uuid: uuid,
                    tagtiangbot_provider_id: DC[i].provider,
                    qty_cable: parseInt(DC[i].qty),
                    type: 'DC'
                })
                dcQty += parseInt(DC[i].qty)
            }

            const localTime = await moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        
            const tag = {
                witel: req.user.witel,
                sto: rev.sto,
                id: rev.id,
                nomor_tiang: rev.nomor_tiang,
                lat_origin: rev.lat,
                longi_origin: rev.longi,
                address,
                // date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                date: localTime,
                users_id: req.user.id,
                uuid,
                from_id: req.user.id_telegram,
                evidence_pole: `/evidence/pole/${idPole}/${img_name}`,
                evidence_ku_dc: `/evidence/kudc/${idPole}/${img_name}`,
                qty_ku_cable: kuQty,
                qty_dc_cable: dcQty,
                condition_odp,
                condition_odcb,
                condition_alpro_competitor,
                lat_tagging: lat,
                longi_tagging: long
            }
            // console.log(tag.date)
        
            const check = await tagtiangbot_checklist_tiang_r5.findOne({ where: { id: idPole } })
        
            if (!check) {
                await tagtiangbot_checklist_tiang_r5.create(tag)
                    .then(async () => {
                        await tagtiangbot_checklist_tiang_r5_provider.bulkCreate(KUDC, {
                            fields: ['tagtiangbot_checklist_uuid', 'tagtiangbot_provider_id', 'qty_cable', 'type']
                        })
                            .then(async () => {
                                const kudcNewPath = path.join(kudcPath, idPole)
                                const poleNewPath = path.join(polePath, idPole)
        
                                if (!fs.existsSync(kudcNewPath)) {
                                    await fs.mkdirSync(kudcNewPath)
                                }
                                if (!fs.existsSync(poleNewPath)) {
                                    await fs.mkdirSync(poleNewPath)
                                }
                                await fs.writeFileSync(path.join(kudcNewPath, img_name), req.files['kudcImage'][0].buffer)
                                await fs.writeFileSync(path.join(poleNewPath, img_name), req.files['poleImage'][0].buffer)
        
                                if (alproKompetitor?.type) {
                                    const alproNewPath = path.join(alproPath, idPole)
        
                                    if (!fs.existsSync(alproNewPath)) {
                                        await fs.mkdirSync(alproNewPath)
                                    }
                                    await fs.writeFileSync(path.join(alproNewPath, img_name), req.files['alproImage'][0]?.buffer)
                                }
                                if (ODP) {
                                    const odpNewPath = path.join(odpPath, idPole)
                                    
                                    if (!fs.existsSync(odpNewPath)) {
                                        await fs.mkdirSync(odpNewPath)
                                    }
                                    await fs.writeFileSync(path.join(odpNewPath, img_name), req.files['ODPImage'][0]?.buffer)
                                }
                                if (ODCB) {
                                    const odcbNewPath = path.join(odcbPath, idPole)
        
                                    if (!fs.existsSync(odcbNewPath)) {
                                        await fs.mkdirSync(odcbNewPath)
                                    }
                                    await fs.writeFileSync(path.join(odcbNewPath, img_name), req.files['ODCBImage'][0]?.buffer)
                                }
                            })
                            .then(() => {
                                res.status(200).json({ message: `terima kasih ${req.user.name} teknisi witel ${req.user.witel}` })
                            })
                            .catch((err) => {
                                res.status(500)
                                console.log(err)
                            })
                    })
                    .catch((err) => {
                        res.status(500)
                        console.log(err)
                    })
            } else {
                await tagtiangbot_checklist_tiang_r5_provider.destroy({ where: { tagtiangbot_checklist_uuid: check.uuid } })
                    .then(async () => {
                        await tagtiangbot_checklist_tiang_r5.update(tag, { where: { id: idPole } })
                            .then(async () => {
                                await tagtiangbot_checklist_tiang_r5_provider.bulkCreate(KUDC, {
                                    fields: ['tagtiangbot_checklist_uuid', 'tagtiangbot_provider_id', 'qty_cable', 'type']
                                })
                                    .then(async () => {
                                        const kudcNewPath = path.join(kudcPath, idPole)
                                        const poleNewPath = path.join(polePath, idPole)
                                        // console.log(req.files)
        
                                        if (!fs.existsSync(kudcNewPath)) {
                                            await fs.mkdirSync(kudcNewPath)
                                        }
                                        if (!fs.existsSync(poleNewPath)) {
                                            await fs.mkdirSync(poleNewPath)
                                        }
                                        await fs.writeFileSync(path.join(kudcNewPath, img_name), req.files['kudcImage'][0].buffer)
                                        // console.log("ini jalan")
                                        await fs.writeFileSync(path.join(poleNewPath, img_name), req.files['poleImage'][0].buffer)
        
                                        if (alproKompetitor?.type) {
                                            const alproNewPath = path.join(alproPath, idPole)
                                            // console.log("ini jalan")
                                            if (!fs.existsSync(alproNewPath)) {
                                                await fs.mkdirSync(alproNewPath)
                                            }
                                            await fs.writeFileSync(path.join(alproNewPath, img_name), req.files['alproImage'][0]?.buffer)
                                            // console.log("ini jalan")
                                        }
                                        if (ODP) {
                                            const odpNewPath = path.join(odpPath, idPole)
        
                                            if (!fs.existsSync(odpNewPath)) {
                                                await fs.mkdirSync(odpNewPath)
                                            }
                                            await fs.writeFileSync(path.join(odpNewPath, img_name), req.files['ODPImage'][0]?.buffer)
                                        }
                                        if (ODCB) {
                                            const odcbNewPath = path.join(odcbPath, idPole)
        
                                            if (!fs.existsSync(odcbNewPath)) {
                                                await fs.mkdirSync(odcbNewPath)
                                            }
                                            await fs.writeFileSync(path.join(odcbNewPath, img_name), req.files['ODCBImage'][0]?.buffer)
                                        }
                                    })
                                    .then(() => {
                                        res.status(200).json({ message: `terima kasih ${req.user.name} teknisi witel ${req.user.witel}` })
                                    })
                                    .catch((err) => {
                                        res.status(500)
                                        console.log(err)
                                    })
                            })
                            .catch((err) => {
                                res.status(500)
                                console.log(err)
                            })
                    })
                    .catch((err) => {
                        res.status(500)
                        console.log(err)
                    })
            }
        })
}

module.exports = {
    findPole,
    tagging,
    getProv,
    getSTO,
    newPole
}