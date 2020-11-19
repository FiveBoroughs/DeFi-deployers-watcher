require('dotenv').config()
const axios = require('axios')
const BigNumber = require('bignumber.js')
const fs = require('fs');
const Web3 = require('web3');

const web3http = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_MAINNET_API_KEY}`))
const web3 = new Web3(new Web3.providers.WebsocketProvider(`wss://mainnet.infura.io/ws/v3/${process.env.INFURA_MAINNET_API_KEY}`))
const tgBaseUrl = `https://api.telegram.org/bot${process.env.TG_BOT_API_KEY}`

const watchlist = [
    { name: 'Yearn deployer 1', address: '0x2D407dDb06311396fE14D4b49da5F0471447d45C'.toLowerCase() },

    { name: 'Curve deployer 1', address: '0xC447FcAF1dEf19A583F97b3620627BF69c05b5fB'.toLowerCase() },
    { name: 'Curve deployer 2', address: '0xbabe61887f1de2713c6f97e567623453d3C79f67'.toLowerCase() },

    { name: 'MakerDAO deployer 1', address: '0x4f26ffbe5f04ed43630fdc30a87638d53d0b0876'.toLowerCase() },
    { name: 'MakerDAO deployer 2', address: '0xdb33dfd3d61308c33c63209845dad3e6bfb2c674'.toLowerCase() },
    { name: 'MakerDAO deployer 3', address: '0x00daa9a2d88bed5a29a6ca93e0b7d860cd1d403f'.toLowerCase() },
    { name: 'MakerDAO deployer 4', address: '0xddb108893104de4e1c6d0e47c42237db4e617acc'.toLowerCase() },
    { name: 'MakerDAO Deployer 5', address: '0xDa0FaB05039809e63C5D068c897c3e602fA97457'.toLowerCase() },

    { name: 'Melon deployer 1', address: '0x0d580ae50b58fe08514deab4e38c0dfdb0d30adc'.toLowerCase() },

    { name: 'Synthetix deployer 1', address: '0xde910777c787903f78c89e7a0bf7f4c435cbb1fe'.toLowerCase() },
    { name: 'Synthetix deployer 2', address: '0xe88ada0408f187c17eedd256a0495d8e3766aac4'.toLowerCase() },
    { name: 'Synthetix deployer 3', address: '0xb64ff7a4a33acdf48d97dab0d764afd0f6176882'.toLowerCase() },
    { name: 'Synthetix deployer 4', address: '0x77a2cd8e930eacf196105ca06837d8b3edecf1a5'.toLowerCase() },
    { name: 'Synthetix deployer 5', address: '0xea5e288b4f9d7e66da162e2af0db371783f62454'.toLowerCase() },
    { name: 'Synthetix deployer 6', address: '0xccf1242cb1d7d56b428dac2bd68a5cace1b067e7'.toLowerCase() },
    { name: 'Synthetix deployer 7', address: '0xb10c85274d2a58ddec72c1d826e75256ff93dead'.toLowerCase() },
    { name: 'Synthetix deployer 8', address: '0xaf28cec7854e9a070f4cd31f18ba005f874d9f50'.toLowerCase() },
    { name: 'Synthetix deployer 9', address: '0xde91067660f6e19ae03fba96d6926a0897b5f5be'.toLowerCase() },
    { name: 'Synthetix deployer 10', address: '0xf2827848dbee5d46e9c7c4c3f5e197e3af811105'.toLowerCase() },
    { name: 'Synthetix Deployer 11', address: '0xe88aDA0408F187C17EedD256A0495d8E3766AAc4'.toLowerCase() },

    { name: 'Bancor deployer 1', address: '0xdfee8dc240c6cadc2c7f7f9c257c259914dea84e'.toLowerCase() },
    { name: 'Bancor deployer 2', address: '0x009bb5e9fcf28e5e601b7d0e9e821da6365d0a9c'.toLowerCase() },
    { name: 'Bancor deployer 3', address: '0xc8021b971e69e60c5deede19528b33dcd52cdbd8'.toLowerCase() },
    { name: 'Bancor deployer 4', address: '0xf2ad4572ce38408ac846852a8a2b361ecb76e4fb'.toLowerCase() },

    { name: 'Jarvis deployer 1', address: '0x0d54aadd7ce2dc10eb9527c6105a3c3f1b463d1b'.toLowerCase() },

    { name: 'Chainlink deployer 1', address: '0x6f61507f902e1c22bcd7aa2c0452cd2212009b61'.toLowerCase() },

    { name: 'dForce deployer 1', address: '0x377598d56030b2d6a9e83f20d44ba3b10ddfa2d5'.toLowerCase() },

    { name: 'Bitfinex Deployer 1', address: '0x5dbdebcae07cc958ba5290ff9deaae554e29e7b4'.toLowerCase() },
    { name: 'Bitfinex Deployer 2', address: '0x2ee3b2df6534abc759ffe994f7b8dcdfaa02cd31'.toLowerCase() },
    { name: 'Bitfinex Deployer 3', address: '0xe1f3c653248de6894d683cb2f10de7ca2253046f'.toLowerCase() },
    { name: 'Bitfinex Deployer 4', address: '0x2903cadbe271e057edef157340b52a5898d7424f'.toLowerCase() },
    { name: 'Bitfinex Deployer 5', address: '0x36928500bc1dcd7af6a2b4008875cc336b927d57'.toLowerCase() },
    { name: 'Bitfinex Deployer 6', address: '0x14d06788090769f669427b6aea1c0240d2321f34'.toLowerCase() },

    { name: 'Kyber Deployer 1', address: '0x8007ce15acda724689760b4ba493d4766f973649'.toLowerCase() },
    { name: 'Kyber Deployer 2', address: '0xe79bc2c998ff2a154ae35bb7ce68555e7fc94ef9'.toLowerCase() },
    { name: 'Kyber Deployer 3', address: '0xbdd33f411da0b40018922a3bc69001b458227f5c'.toLowerCase() },
    { name: 'Kyber Deployer 4', address: '0x346fbe5d02c89fb4599f33bdce987981d573740a'.toLowerCase() },

    { name: 'IDEX Deployer 1', address: '0x33daedabab9085bd1a94460a652e7ffff592dfe3'.toLowerCase() },

    { name: 'Zapper.Fi Deployer 1', address: '0x19627796b318e27c333530ad67c464cfc37596ec'.toLowerCase() },
    { name: 'Zapper.Fi Deployer 2', address: '0xa0863436913b1b439ccaa6fbf89408116c1dde29'.toLowerCase() },

    { name: 'Ren Deployer 1', address: '0xfe45ab17919759cfa2ce35215ead5ca4d1fc73c7'.toLowerCase() },

    { name: 'ParaSwap Deployer 1', address: '0x60fb0b38ff0fcb98462e70aa5da4dff047635ec3'.toLowerCase() },
    { name: 'ParaSwap Deployer 2', address: '0xe6b692dcc972b9a5c3c414ac75ddc420b9edc92d'.toLowerCase() },

    { name: 'Opyn Deployer', address: '0x9e68b67660c223b3e0634d851f5df821e0e17d84'.toLowerCase() },

    { name: 'Aave Deployer 1', address: '0xfe1a6056ee03235f30f7a48407a5673bbf25ed48'.toLowerCase() },
    { name: 'Aave Deployer 2', address: '0x2fbb0c60a41cb7ea5323071624dcead3d213d0fa'.toLowerCase() },
    { name: 'Aave Deployer 3', address: '0x51F22ac850D29C879367A77D241734AcB276B815'.toLowerCase() },

    { name: 'Cream Deployer 1', address: '0x197939c1ca20C2b506d6811d8B6CDB3394471074'.toLowerCase() },

    { name: 'Uniswap Deployer 1', address: '0xD1C24f50d05946B3FABeFBAe3cd0A7e9938C63F2'.toLowerCase() },
    { name: 'Uniswap Deployer 2', address: '0x9C33eaCc2F50E39940D3AfaF2c7B8246B681A374'.toLowerCase() },

    { name: '1Inch Deployer 1', address: '0x5FE3B8B19949C04DA3f578c6468F3d444CD7A9BB'.toLowerCase() },
    { name: '1Inch Deployer 2', address: '0x7E1E3334130355799F833ffec2D731BCa3E68aF6'.toLowerCase() },
    { name: '1Inch Deployer 3', address: '0x083fc10cE7e97CaFBaE0fE332a9c4384c5f54E45'.toLowerCase() },

    { name: '0x Deployer 1', address: '0x2d7dc2Ef7c6F6a2CBc3dBa4dB97B2Ddb40e20713'.toLowerCase() },
    { name: '0x Deployer 2', address: '0x3B39078f2A3E1512eecc8D6792fDc7F33E1cD2CF'.toLowerCase() },

    { name: 'AlphaFinance Deployer 1', address: '0x1AAf4143C3Fe0D7CA78381C4672E4b08C4Bc009F'.toLowerCase() },
    { name: 'AlphaFinance Deployer 2', address: '0xB593d82d53e2c187dc49673709a6E9f806cdC835'.toLowerCase() },

    { name: 'Ampleforth Deployer 1', address: '0xd8461BD73F19E3d789Ac0E5dbF1AD62FBBd15C22'.toLowerCase() },

    { name: 'APYFinance Deployer 1', address: '0x7E9b0669018a70D6EfCCA2b11850A704DB0E5b04'.toLowerCase() },

    { name: 'Aragon Deployer 1', address: '0xd5931f0a36FE76845a5330f6D0cd7a378401e34d'.toLowerCase() },
    { name: 'Aragon Deployer 2', address: '0x6F49A56621491785546e12fd036488f780DAc233'.toLowerCase() },

    { name: 'Auctus Deployer 1', address: '0xd1B10607921C78D9a00529294C4b99f1bd250E1c'.toLowerCase() },

    { name: 'Audius Deployer 1', address: '0xDE21d46753633a177223FaA6E56e8F6CD24cca04'.toLowerCase() },

    { name: 'Augur Deployer 1', address: '0xd82369aaeC27C7a749AFDb4eb71ADD9E64154cd6'.toLowerCase() },
    { name: 'Augur Deployer 2', address: '0x4925DC0BAF2Bcf7D20b19f5b2Fc2be44E3806931'.toLowerCase() },
    { name: 'Augur Deployer 3', address: '0xa218c65Ac17B57457a60d57b689F7972416522EA'.toLowerCase() },
    { name: 'Augur Deployer 4', address: '0x87876F172087E2fb5838E655DC6A929dC2Dcf85c'.toLowerCase() },
    { name: 'Augur Deployer 5', address: '0xBCc9946143534E28C3baD116cea0F81b9b208799'.toLowerCase() },

    { name: 'Axie Deployer 1', address: '0x01bf1d7C5e192313C26414e134584275F46271cF'.toLowerCase() },

    { name: 'Balancer Deployer 1', address: '0x6E9eEF9b53a69F37EFcAB8489706E8B2bD82608b'.toLowerCase() },
    { name: 'Balancer Deployer 2', address: '0x24A12Fa313F57aF541d447c594072A992c605DCf'.toLowerCase() },

    { name: 'Bancor Deployer 1', address: '0xdfeE8DC240c6CadC2c7f7f9c257c259914dEa84E'.toLowerCase() },
    { name: 'Bancor Deployer 2', address: '0xB93081c32beFda94168483c78b780E601f07B192'.toLowerCase() },
    { name: 'Bancor Deployer 3', address: '0x009BB5e9fCF28E5E601B7D0e9e821da6365d0a9c'.toLowerCase() },
    { name: 'Bancor Deployer 4', address: '0xc8021b971e69e60C5Deede19528B33dCD52cDbd8'.toLowerCase() },
    { name: 'Bancor Deployer 5', address: '0xf2ad4572CE38408AC846852a8a2b361eCb76E4Fb'.toLowerCase() },

    { name: 'Band Deployer 1', address: '0x34F9E4C71e875B4944Ffd146813ac807E2a9dD4F'.toLowerCase() },

    { name: 'BasedMoney Deployer 1', address: '0x9e3C40045A3503b33BfEdAEA0BF6981120E8c753'.toLowerCase() },

    { name: 'Binance Deployer 1', address: '0x00C5E04176d95A286fccE0E68c683Ca0bfec8454'.toLowerCase() },
    { name: 'Binance Deployer 2', address: '0x426903241ADA3A0092C3493a0C795F2ec830D622'.toLowerCase() },

    { name: 'BoostedFinance Deployer 1', address: '0xd87e80bCd2527508b617dc33F4b73Dc5DdA200a2'.toLowerCase() },

    { name: 'BoringDAO Deployer 1', address: '0x67Ee188Ee1319CDAc271553e7b8FAAed2fBC52CC'.toLowerCase() },

    { name: 'BounceFinance Deployer 1', address: '0xc6a34b2bf59baF984884A0cf4C84eD1541E710d7'.toLowerCase() },

    { name: 'Chai Deployer 1', address: '0xc3455912Cf4bF115835A655c70bCeFC9cF4568eB'.toLowerCase() },

    { name: 'ChainLink Deployer 1', address: '0x6f61507F902e1c22BCd7aa2C0452cd2212009B61'.toLowerCase() },

    { name: 'CoFix Deployer 1', address: '0xf02F6A0F347CC664fFfd55591A765F403E610d8E'.toLowerCase() },

    { name: 'Compound Deployer 1', address: '0xA7ff0d561cd15eD525e31bbe0aF3fE34ac2059F6'.toLowerCase() },
    { name: 'Compound Deployer 2', address: '0x1449e0687810BdDD356ae6Dd87789244A46d9AdB'.toLowerCase() },
    { name: 'Compound Deployer 3', address: '0xCec237E83a080F3225AB1562605EE6DEDF5644Cc'.toLowerCase() },
    { name: 'Compound Deployer 4', address: '0xfe83aF639f769EaD20baD76067AbC120245a06A9'.toLowerCase() },

    { name: 'Cream Deployer 1', address: '0x197939c1ca20C2b506d6811d8B6CDB3394471074'.toLowerCase() },

    { name: 'DeFiDollar Deployer 1', address: '0x08F7506E0381f387e901c9D0552cf4052A0740a4'.toLowerCase() },

    { name: 'DevProtocol Deployer 1', address: '0x1dCb85efEa6A3FB528d19B9174E88ee35BfF540a'.toLowerCase() },

    { name: 'DeversiFi Deployer 1', address: '0x325870CB1c06C3A619e461425712248FE269AFCa'.toLowerCase() },

    { name: 'Dharma Deployer 1', address: '0x7e4A8391C728fEd9069B2962699AB416628B19Fa'.toLowerCase() },

    { name: 'dForce Deployer 1', address: '0x377598d56030b2d6a9E83f20d44ba3B10ddFA2D5'.toLowerCase() },

    { name: 'dHedge Deployer 1', address: '0xF53B44df6d16273A9E6299465404aDd7b90fb70a'.toLowerCase() },

    { name: 'dYdX Deployer 1', address: '0xA2f79147143E9100e1Dd65Df277Ac54825197148'.toLowerCase() },

    { name: 'DeFiSaver Deployer 1', address: '0x6c259ea1fCa0D1883e3FFFdDeb8a0719E1D7265f'.toLowerCase() },

    { name: 'ForTube Deployer 1', address: '0x00ad504D2C02E0DDbf660bc35926712d0F0feA9e'.toLowerCase() },

    { name: 'Geyser Deployer 1', address: '0xA80481E3f9098602954B2E5cf306e6dEE053EF3E'.toLowerCase() },

    { name: 'Hakka Deployer 1', address: '0x1D075f1F543bB09Df4530F44ed21CA50303A65B2'.toLowerCase() },

    { name: 'Harvest Deployer 1', address: '0xf00dD244228F51547f0563e60bCa65a30FBF5f7f'.toLowerCase() },

    { name: 'Hedget Deployer 1', address: '0xEBdDe0641202ea77Af5edaA105ae6A6c006C6551'.toLowerCase() },

    { name: 'Hegic Deployer 1', address: '0xF15968a096Fc8F47650001585d23bEE819b5affb'.toLowerCase() },
    { name: 'Hegic Deployer 2', address: '0xcc1Ab2A23cd49266A9bEb315a7104187373bACe9'.toLowerCase() },

    { name: 'HolyHeld Deployer 1', address: '0xb754601d2C8C1389E6633b1449B84CcE57788566'.toLowerCase() },

    { name: 'IndexCoop Deployer 1', address: '0xe501D177fE2172E1dA8a6D338a44d9f89705ed5C'.toLowerCase() },

    { name: 'Injective Deployer 1', address: '0x03e3bfB5634Bd62bc74423E77eaf16991076b4Ad'.toLowerCase() },

    { name: 'KeeperDAO Deployer 1', address: '0x3C530cB040d71047D94791fddC5CC8e54b648730'.toLowerCase() },

    { name: 'Linear Deployer 1', address: '0x74E5d6C26DFbEB647DFE36F44FeE805BAfEfbFc0'.toLowerCase() },

    { name: 'Loopring Deployer 1', address: '0x6d4ee35D70AD6331000E370F079aD7df52E75005'.toLowerCase() },
    { name: 'Loopring Deployer 2', address: '0x5593b2B8Dc63d0ed68aa8f885707b2Dc5787E391'.toLowerCase() },

    { name: 'NexusMutual Deployer 1', address: '0x1B541c2dC0653FD060E8320D2F763733BA8Cffe3'.toLowerCase() },

    { name: 'NuCypher Deployer 1', address: '0xebA17F35955E057a8d2e74bD4638528851d8E063'.toLowerCase() },

    { name: 'OMG Deployer 1', address: '0x140427a7D27144A4cDa83bD6b9052a63b0c5B589'.toLowerCase() },
    { name: 'OMG Deployer 2', address: '0x13f6d257d0F43686b8163AaDfE68618A035FfF14'.toLowerCase() },
    { name: 'OMG Deployer 3', address: '0x27b4C9e627F66eB3c7Bf0E98751Bd721615D3B21'.toLowerCase() },
    { name: 'OMG Deployer 4', address: '0x18c1b1A32C0bF7F7B953d83bCf6577A38197066B'.toLowerCase() },

    { name: 'ParaSwap Deployer 1', address: '0x60Fb0b38ff0fCb98462E70Aa5DA4Dff047635EC3'.toLowerCase() },
    { name: 'ParaSwap Deployer 2', address: '0xe6B692dcC972b9a5C3C414ac75dDc420B9eDC92d'.toLowerCase() },

    { name: 'Pickle Deployer 1', address: '0x907D9B32654B8D43e8737E0291Ad9bfcce01DAD6'.toLowerCase() },

    { name: 'Perp Deployer 1', address: '0x902cF1f90556A127dD085B5abaA97a89769bAdA4'.toLowerCase() },

    { name: 'Radix Deployer 1', address: '0xd1D429F61e02DB829c08B1966aB025c02B8308C8'.toLowerCase() },

    { name: 'RampDefi Deployer 1', address: '0x76E2b8125b3f42cb1763BE4173c269b7725499D9'.toLowerCase() },

    { name: 'RariCapital Deployer 1', address: '0xdbDA819B4166edDd54E4F98B48550bC43a3DE2aD'.toLowerCase() },
    { name: 'RariCapital Deployer 2', address: '0xB8f02248d53F7EdfA38E79263e743e9390f81942'.toLowerCase() },

    { name: 'Reflexer Deployer 1', address: '0x5581364f1350B82Ed4E25874f3727395BF6Ce490'.toLowerCase() },

    { name: 'S.Finance Deployer 1', address: '0x71e3216f355113d2DA7f27C9c5B0F83c816fb04B'.toLowerCase() },

    { name: 'Sablier Deployer 1', address: '0x7c25bB1dd0FB91C69664c461909161A14DEE9782'.toLowerCase() },

    { name: 'SakeSwap Deployer 1', address: '0x142151D3b15b8961F2937Cf7880Bcd10c050800C'.toLowerCase() },

    { name: 'Serum Deployer 1', address: '0xe8cb77c2585051AA4E2D05fAbbAf9Bb40a0C5eBE'.toLowerCase() },

    { name: 'TokenSets Deployer 1', address: '0x69Bdb276A17Dd90F9D3A545944CCB20E593ae8E3'.toLowerCase() },
    { name: 'TokenSets Deployer 2', address: '0x6C4B7A83D2a301f7Dd3563812A15F31A1e973b4C'.toLowerCase() },

    { name: 'Skale Deployer 1', address: '0xE74ad5437C6CFB0cCD6bADda1F6b57b6E542E75e'.toLowerCase() },

    { name: 'SnowSwap Deployer 1', address: '0x0822d138AaE127789eA42Abae034D39f7dcD5DC1'.toLowerCase() },

    { name: 'SynLev Deployer 1', address: '0xa2E316CbfA81640ce509ab487867a136b75C83C4'.toLowerCase() },

    { name: 'Swerve Deployer 1', address: '0xA6dF4fcB1Ca559155A678e9AFf5DE3F210C0ff84'.toLowerCase() },

    { name: 'UniLend Deployer 1', address: '0x6dc6456B093551eFf2Dc40002A0367258a8bAC33'.toLowerCase() },

    { name: 'wBTC Deployer 1', address: '0x8b41783AD99FCBeB8d575fA7A7b5a04fA0b8d80b'.toLowerCase() },

    { name: 'Vamp Deployer 1', address: '0x45a6b8BdfC1FAa745720165e0B172A3D6D4EC897'.toLowerCase() },

    { name: 'ValueDeFi Deployer 1', address: '0x7Be4D5A99c903C437EC77A20CB6d0688cBB73c7f'.toLowerCase() },

    { name: 'UpBots Deployer 1', address: '0xBa8dE353788fd4373de94abb9EaFC7085c1d8667'.toLowerCase() },

    { name: 'xDai Deployer 1', address: '0xc7de769D23C2b64cF0144da98484feEDADFae531'.toLowerCase() },

    { name: 'Yam Deployer 1', address: '0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84'.toLowerCase() },

    { name: 'yAxis Deployer 1', address: '0x5661bF295f48F499A70857E8A6450066a8D16400'.toLowerCase() },

    { name: 'Zapper Deployer 1', address: '0x19627796b318E27C333530aD67c464Cfc37596ec'.toLowerCase() },

    { name: 'Zerion Deployer 1', address: '0xD8282A355383A6513EccC8a16F990bA0026C2d1a'.toLowerCase() },

    { name: 'zLOT Deployer 1', address: '0x2cDdCbc4305ba08a97A0ddE1AB9F07A6639F124e'.toLowerCase() },
]

const alert = async (message) => {
    const res = await axios.post(tgBaseUrl + '/sendMessage', {
        'chat_id': process.env.TG_CHAT_ID,
        'text': message
    })
    return res
}

(async () => {

    const addresses = watchlist.map(x => x.address)
    let subscription = web3.eth.subscribe('logs', {
        address: addresses
    }, async function (error, result) {
        if (error)
            console.error(result);
        else {
            const tx = await web3http.eth.getTransactionReceipt(result.transactionHash);
            if (tx.contractAddress != null) {
                console.log('possible deployment', watchlist.filter(x => x.address == tx.from.toLowerCase() || x.address == tx.to.toLowerCase())[0].name, tx.transactionHash)
                alert('possible deployment ' + watchlist.filter(x => x.address == tx.from.toLowerCase() || x.address == tx.to.toLowerCase())[0].name + ', @ ' + tx.transactionHash)
            }
        }

    })
        .on("error", (error) => { console.error(error); alert(error) })
        .on("connected", (subscriptionId) => { console.log('started', subscriptionId); alert('started ' + subscriptionId) })
})();
