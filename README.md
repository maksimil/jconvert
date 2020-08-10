# jconvert

This project is using neural networks and training to copy linear image filters. Files _testdata/test_1.jpg_ and _testdata/test_1_out.jpg_ are results of such filter.

## Linear filters

Filters are called linear, because they convert from input rgb vector to output rgb vector using affine transforms.

## Training

Training is achieved via minimizing the loss function, wich is sum of squared differences of elements of expected and actual output of network.

## Inspiration

This project is inspired by Jojo's color switch.
