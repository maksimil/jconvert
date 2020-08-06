export type Color = [number, number, number];

export interface DataPair {
    input: Color;
    eoutput: Color;
}

export interface Filter {
    bias: Color;
    matrix: [Color, Color, Color];
}

const dot = (a: Color, b: Color) => {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

const loss = (a: Color, b: Color) => {
    const s = <Color>[a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    return dot(s, s);
};

const combine = (a: Filter, b: Filter) => {
    let res = makenet(false);
    for (let i = 0; i < 3; i++) {
        res.bias[i] = a.bias[i] + b.bias[i];
        for (let j = 0; j < 3; j++) {
            res.matrix[i][j] = a.matrix[i][j] + b.matrix[i][j];
        }
    }
    return res;
};

const scale = (s: number, n: Filter) => {
    let res = makenet(false);
    for (let i = 0; i < 3; i++) {
        res.bias[i] = s * n.bias[i];
        for (let j = 0; j < 3; j++) {
            res.matrix[i][j] = s * n.matrix[i][j];
        }
    }
    return res;
};

export const makenet = (rand: boolean) => {
    let res: Filter = {
        bias: [0, 0, 0],
        matrix: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
    };

    if (rand) {
        for (let i = 0; i < 3; i++) {
            res.bias[i] = Math.random();
            for (let j = 0; j < 3; j++) {
                res.matrix[i][j] = Math.random();
            }
        }
    }

    return res;
};

export const apply = (network: Filter, color: Color) => {
    let out: Color = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        out[i] = dot(color, network.matrix[i]) + network.bias[i];
    }
    return out;
};

export const delta = (network: Filter, data: DataPair) => {
    let res = makenet(false);
    let z = apply(network, data.input);

    for (let i = 0; i < 3; i++) {
        res.bias[i] = 2 * (z[i] - data.eoutput[i]);
        for (let j = 0; j < 3; j++) {
            res.matrix[i][j] = res.bias[i] * data.input[j];
        }
    }
    return res;
};

export interface Trainconfig {
    epochs: number;
    eta: number;
    leta: number;
    testlength: number;
}

export const trainer = (data: DataPair[]) => {
    const test = (network: Filter, length: number) => {
        const datalength = data.length;

        let res = 0;

        for (let t = 0; t < length; t++) {
            let datapair = data[Math.floor(Math.random() * datalength)];
            res += loss(datapair.eoutput, apply(network, datapair.input));
        }
        return res / length;
    };
    const train = (network: Filter, config: Trainconfig) => {
        let lres = test(network, config.testlength);

        const datalength = data.length;

        for (let epoch = 0; epoch < config.epochs; epoch++) {
            let deltas = makenet(false);

            for (let i = 0; i < datalength; i++) {
                deltas = combine(deltas, delta(network, data[i]));
            }

            let localeta = config.eta;

            for (let i = 0; i < config.leta; i++) {
                let nn = combine(
                    network,
                    scale(-localeta / datalength, deltas)
                );
                let nres = test(nn, config.testlength);

                if (nres < lres || i === config.leta - 1) {
                    lres = nres;
                    network = nn;
                    break;
                }

                localeta /= 2;
            }
        }

        return network;
    };
    return { test, train };
};
