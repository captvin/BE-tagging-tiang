const { data_tiang_r5, tagtiangbot_checklist_tiang_r5, tagtiangbot_checklist_tiang_r5_provider, allprovider, sequelize} = require('@models')
const { NotFound, Forbidden } = require('http-errors')
const { Op, Sequelize, QueryTypes } = require('sequelize')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const { format } = require('date-fns')
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


    res.status(200).json(mergedResultsInMeter)
}

async function tagging(req, res, next) {
    const { idPole, KU, DC, address, ODP, ODCB, alproKompetitor, lat, long } = req.body
    // console.log({idPole, KU, DC, address, ODP, ODCB, alproKompetitor, lat, long})
    // res.json({idPole, KU, DC, address, ODP, ODCB, alproKompetitor, lat, long})
    // console.log(req.files['ODP[evidence]'][0].fieldname)
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

    if (!alproKompetitor) {
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

    // console.log(req.user)

    const tag = {
        witel: req.user.witel,
        sto: rev.sto,
        id: rev.id,
        nomor_tiang: rev.nomor_tiang,
        lat_origin: rev.lat,
        longi_origin: rev.longi,
        address,
        date: format(new Date(), 'yyy-MM-dd HH:mm:ss'),
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
    // console.log(check)

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

                        if (alproKompetitor) {
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
                        res.status(500).send(err)
                    })
            })
            .catch((err) => {
                res.status(500).send(err)
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

                                if (!fs.existsSync(kudcNewPath)) {
                                    await fs.mkdirSync(kudcNewPath)
                                }
                                if (!fs.existsSync(poleNewPath)) {
                                    await fs.mkdirSync(poleNewPath)
                                }
                                await fs.writeFileSync(path.join(kudcNewPath, img_name), req.files['kudcImage'][0].buffer)
                                await fs.writeFileSync(path.join(poleNewPath, img_name), req.files['poleImage'][0].buffer)

                                if (alproKompetitor) {
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
                                res.status(500).send('Something went wrong2')
                            })
                    })
                    .catch((err) => {
                        res.status(500).send('Something went wrong3')
                    })
            })
            .catch((err) => {
                res.status(500).send('Something went wrong4')
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

// async function create(req, res, next) {
//     if (req.user.abilities.cannot('create', unit)) {
//         return next(Forbidden())
//     }
//     const { body } = req
//     const image = req.file?.originalname
//     const nomor_unit = body.nomor_unit
//     body.status = 'tersedia'
//     const already = await unit.findOne({ where: { nomor_unit } })
//     if (!image) {

//         if (already) {
//             return res.send({ message: "Unit already exists" })
//         }
//         else {
//             body.image = "no_image.jpg"
//             const result = await unit.create(body)
//             res.send(result)
//         }
//     }

//     else {
//         if (already) {
//             return res.send({ message: "Unit already exists" })
//         }
//         else {
//             const img_name = "img-" + Date.now() + path.extname(image)
//             body.image = img_name
//             const buf = req.file.buffer
//             fs.writeFileSync(path.join(imagePath, img_name), buf)
//             const result = await unit.create(body)
//             res.send({result})
//         }
//     }

// }

// async function update(req, res, next) {
//     if (req.user.abilities.cannot('update', unit)) {
//         return next(Forbidden())
//     }
//     const { id } = req.params
//     const { body } = req
//     const nomor_unit = body.nomor_unit
//     const already = await unit.findOne({ where: { [Op.and]: [{ nomor_unit: { [Op.like]: nomor_unit } }, { id: { [Op.ne]: id } }] } })
//     const image = req.file?.originalname

//     if (!image) {
//         if (already) {
//             return res.json({ message: "Unit already exists" })
//         }
//         else {

//             const data = await unit.findOne({ where: { id } })
//             body.image = (data.image)
//             const result = await unit.update(body, { where: { id } })
//             result[0]
//                 ? res.json({ message: 'successfully updated' })
//                 : next(NotFound())
//         }
//     }
//     else {
//         if (already) {
//             return res.send({ message: "Unit already exists" })
//         }
//         else {
//             const data = await unit.findOne({ where: { id } })
//             const img_name = "img-" + Date.now() + path.extname(image)
//             body.image = img_name

//             if (data.image !== "no_image.jpg") {
//                 fs.unlinkSync(path.join(imagePath, data.image))
//                 const buf = req.file.buffer
//                 fs.writeFileSync(path.join(imagePath, img_name), buf)
//                 const result = await unit.update(body, { where: { id } })
//                 result[0]
//                     ? res.json({ message: 'Successfully updated' })
//                     : next(NotFound())

//             }
//             else {
//                 const buf = req.file.buffer
//                 fs.writeFileSync(path.join(imagePath, img_name, buf))
//                 const result = await unit.update(body, { where: { id } })
//                 result[0]
//                     ? res.json({ message: 'Successfully updated', })
//                     : next(NotFound())
//             }

//         }
//     }


// }

// async function remove(req, res, next) {
//     if (req.user.abilities.cannot('delete', unit)) {
//         return next(Forbidden())
//     }
//     const { id } = req.params
//     const data = await unit.findOne({ where: { id } })

//     if (data.image = "no_image.jpg") {
//         const result = await unit.destroy({ where: { id } })
//         result === 1
//             ? res.json({ message: "successfully deleted" })
//             : next(NotFound())
//     }
//     else {
//         fs.unlinkSync(path.join(imagePath, data.image))
//         const result = await unit.destroy({ where: { id } })
//         result === 1
//             ? res.json({ message: 'Successfully deleted' })
//             : next(NotFound())
//     }


// }

// async function service(req, res, next) {
//     if (req.user.abilities.cannot('read', unit)) {
//         return next(Forbidden())
//     }
//     const { id } = req.params
//     let terakhir_service = new Date().toISOString().substr(0, 10)
//     const result = await unit.update({terakhir_service}, {where: {id}})
//     result[0]
//         ? res.json({message: 'unit telah diservice pada tanggal '+ terakhir_service})
//         : next(NotFound())
// }

module.exports = {
    findPole,
    tagging,
    getProv,
    getSTO
}