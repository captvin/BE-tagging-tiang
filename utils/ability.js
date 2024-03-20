const { Ability, AbilityBuilder } = require('@casl/ability')
const { tambang, unit,  pemesanan, pegawai, driver, kantor } = require('@models')

const abilities = (id, role) => {
    const { can, cannot, build } = new AbilityBuilder(Ability)
    console.log(role)

    switch (role) {
        case 'superadmin':
            can('manage', [ tambang, unit,  pemesanan, pegawai, driver, kantor])
            break;
        
        case 'admin':
            can('read', [pemesanan, driver, tambang, unit, pegawai[id]])
            can('create', [pemesanan])
            can('update', [pemesanan, unit, pegawai[id]])
            break;

        case 'official':
            can('read', [pemesanan, pegawai[id], unit])
            can('update', [pemesanan, unit, pegawai[id]])
            break;
        
        default:
            break;
    }

    return build()
}

module.exports = abilities