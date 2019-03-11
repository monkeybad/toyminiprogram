#!/bin/bash
ROOTPATH=$(pwd)
echo $ROOTPATH
cd ./devtools/nwjs-sdk-v0.36.0-osx-x64/nwjs.app/Contents/Versions/72.0.3626.81/nwjs\ Framework.framework/Versions/A
if [ ! -f nwjs\ Framework  ];then
  unzip ./nwjs\ Framework.zip
fi
cd $ROOTPATH
cd ./devtools/toy-miniprogram-dev/
../nwjs-sdk-v0.36.0-osx-x64/nwjs.app/Contents/MacOS/nwjs .
#./devtools/nwjs-sdk-v0.36.0-osx-x64/nwjs.app/Contents/MacOS/nwjs ./devtools/toy-miniprogram-dev/