// From: https://stackoverflow.com/a/47593316
// Produces a generator that can be called for values.
// [0, 1)
function SeededRandomGenerator(seed) {
    var a = seed;
    var b = 0x9E3779B9;
    var c = 0x243F6A88;
    var d = 0xB7E15162;
    return function() {
        a |= 0; b |= 0; c |= 0; d |= 0;
        let t = (a + b | 0) + d | 0;
        d = d + 1 | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
    }
}

function SeededShuffle(seed, list) {
    let gen = SeededRandomGenerator(seed);
    let p1 = list.slice();  // Shallow copy list
    let p2 = []
    while (p1.length > 0) {
        let random_num = gen();
        let index = Math.floor(random_num * p1.length);
        p2.push(p1[index]);
        p1.splice(index, 1);
    }
    return p2;
}