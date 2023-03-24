#!/usr/bin/env sh

# build the plugin

cd EcoSonar-SonarQube
export REACT_APP_BASE_URL_ECOSONAR_API=http://localhost:3000
mvn clean package -DskipTests -Durl=http://localhost:3000
cd ..
