import { makefilter, savefilter } from "./imagefilter";

const { pathsconfig, trainconfig } = JSON.parse(process.argv[2]);

const main = async () => {
  const { filter, loss } = await makefilter(
    pathsconfig.ipath,
    pathsconfig.opath,
    trainconfig
  );

  // Saving filter
  savefilter(filter, pathsconfig.tpath);

  // returning loss
  console.log(JSON.stringify({ loss }));
};

main();
