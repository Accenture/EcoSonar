const path = require("path");

module.exports = {
  // Define the entry points here. They MUST have the same name as the page_id
  // defined in src/main/java/com/ls/java/web/SustainabilityPageDefinition.java
  entry: {
    ecosonar_analysis_page: "./src/main/js/ecosonar_analysis_page/index.js",
    ecosonar_configuration_page: "./src/main/js/ecosonar_configuration_page/index.js",
    ecosonar_bestpractices_page: "./src/main/js/ecosonar_bestpractices_page/index.js",
  },
  output: {
    // The entry point files MUST be shipped inside the final JAR's static/
    // directory.
    path: path.join(__dirname, "../../target/classes/static"),
    filename: "[name].js"
  },
  resolve: {
    modules: [path.resolve(__dirname, "src/main/js"), "node_modules"]
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    "sonar-request": "SonarRequest",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /(node_modules)/
      },
      {
        test: /\.css/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[hash]-[name].[ext]',
            },
          },
        ],
      }
    ]
  }
};
