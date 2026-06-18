const RecommendationServer = require('./src/services/recommendationServer');

async function test() {
    const user1 = 'u_1781793101189_569';
    const user2 = 'u_1781798384998_855';
    const product = '123e4567-e89b-12d3-a456-426614174012';

    console.log('Querying for user1:', user1);
    try {
        const cmd = `get ${user1} ${product}`;
        console.log('Raw command:', cmd);
        const resp = await RecommendationServer._sendCommand(cmd);
        console.log('Raw response:');
        console.log(JSON.stringify(resp));
        
        const parsed = await RecommendationServer.get(user1, product);
        console.log('Parsed products:', parsed);
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
