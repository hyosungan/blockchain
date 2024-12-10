// require('babel-register');
// require('babel-polyfill');

module.exports={
    networks:{
        development:{
            host: '127.0.0.1',
            port: 7545,
            network_id: '*' // Connect to any network
        },
    },
    // contract_directory: './src/contracts/',
    // contract_build_directory: './src/truffle_abis/',
    contract_directory: './contracts/',
    contract_build_directory: './build/contracts/',
    compilers:{
        solc: {
            version: '^0.5.0',
            optimizer: {
                enabled: true,
                runs: 200
            },
        },
    },
}