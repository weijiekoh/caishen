var publicPath = "/";

if (process.env.NODE_ENV == "production"){
  publicPath = "/static/app/"
}

var config = {
  type: 'preact-app',
  webpack: {
    publicPath: publicPath,
    extractText: {
      allChunks: true,
      filename: "app.css"
    },
    rules: {
      fonts: {
        options: {
          name: "[name].[ext]"
        }
      }
    }
  }
}

module.exports = config;
