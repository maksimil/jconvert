import * as net from "./network";
import * as fs from "fs";
const pixels = require("image-pixels");
const ioutput = require("image-output");

export const filterdata = (filter: net.Filter, data: Uint8Array) => {
  // .slice(0) copyies the value
  let output = data.slice(0);

  const length = output.length;
  for (let i = 0; i < length / 4; i++) {
    const v = net.apply(filter, [
      data[4 * i] / 255,
      data[4 * i + 1] / 255,
      data[4 * i + 2] / 255,
    ]);

    for (let j = 0; j < 3; j++) {
      output[4 * i + j] = v[j] * 255;
    }
  }
  return output;
};

export const filterimg = async (
  filter: net.Filter,
  inputpath: string,
  outputpath: string
) => {
  const idata = await pixels(inputpath);

  const ndata = filterdata(filter, idata.data);

  ioutput(
    {
      data: ndata,
      width: idata.width,
      height: idata.height,
    },
    outputpath
  );
};

// Constructors

export const makefilter = async (
  inname: string,
  outname: string,
  config: net.Trainconfig
) => {
  const idata: Uint8Array = (await pixels(inname)).data;
  const eodata: Uint8Array = (await pixels(outname)).data;

  const length = idata.length;

  let data: net.DataPair[] = [];

  for (let i = 0; i < length / 4; i++) {
    data[i] = <net.DataPair>{
      input: [
        idata[4 * i] / 255,
        idata[4 * i + 1] / 255,
        idata[4 * i + 2] / 255,
      ],
      eoutput: [
        eodata[4 * i] / 255,
        eodata[4 * i + 1] / 255,
        eodata[4 * i + 2] / 255,
      ],
    };
  }

  const trainer = net.trainer(data);

  const filter = trainer.train(net.makenet(false), config);
  const loss = trainer.test(filter, config.testlength);

  return { filter, loss };
};

export const loadfilter = (fname: string) => {
  return <net.Filter>JSON.parse(fs.readFileSync(fname, "utf-8"));
};

export const savefilter = (filter: net.Filter, fname: string) => {
  fs.writeFileSync(fname, JSON.stringify(filter));
};
