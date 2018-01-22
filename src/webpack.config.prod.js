//坑 http://blog.csdn.net/paranoidyang/article/details/72898070

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');


module.exports = {
  //输出的文件名,默认合并以后的js会命名为bundle.js
  //entry 为对象时，output要使用[name].js 的形式
  entry:{
    app:'./app',

    //抽取公共框架
    /*vendors:[
      "angular",
      "angular-materia",
      "angular-animate",
      "angular-route",
      "angular-resource"
    ],*/
  },



  resolve:{
    extensions: ['.js', '.less', '.scss', '.css' , '.ng'],
    //设置解析器查找模块的目录
    modules: [
        path.resolve(__dirname, 'node_modules'),
        path.join(__dirname, './')
    ],
  },
  resolveLoader: {
    
  },
   
  //输出
 /* output: {
      filename:prod ?'[name].[hash].js':'[name].js',
      path: path.join(__dirname, 'build'),
      // 指定资源文件引用的目录，也就是说用/assests/这个路径指代path，开启这个配置的话，index.html中应该要引用的路径全部改为'/assets/...'
      publicPath:  'build',
      chunkFilename:prod ? '[name].[hash].js': '[name].js'
  },*/
  output: {
      filename:'static/js/[name].[hash:8].js',
      path: path.join(__dirname, './build'),
      // publicPath:  'build',
      chunkFilename:'static/js/[name].[hash:8].js'
  },


  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        minChunks:2,
    }),
    new ExtractTextPlugin('static/css/[name].[contenthash:8].css'),

    //js压缩
    new webpack.optimize.UglifyJsPlugin({
        //排除关键字
        mangle: {
            except: ['$super', '$', 'exports', 'require', 'module', '_']
        },
        compress: {
            warnings: false
        },
        output: {
            comments: false,
        }
    }),
    
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './build.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    })
  ],

  module : {
    rules : [
      //js
      {
        test:/\.js?$/,
        exclude: /node_modules/,
        use: {
          loader : 'babel-loader',
          options: {
            presets: ['es2015'],
            plugins: ['angularjs-annotate']
          }
        }
      },

      //scss
      {
          test: /\.scss/,
          use: ExtractTextPlugin.extract({
              use: [{
                  loader: 'css-loader',
                  options:{
                      minimize: true //css压缩
                  }
              }, "sass-loader"]
          })
      },
      // less css
      {
          test: /\.(less|css)$/,
          use: ExtractTextPlugin.extract({
              use: [
                    {
                      loader: 'css-loader',
                      options:{
                          minimize: true //css压缩
                      }
                    }, 
                    {
                      loader: 'postcss-loader',
                      options: {
                        ident: 'postcss',
                        plugins: () => [
                          //require('postcss-flexbugs-fixes'),
                          autoprefixer({
                            browsers: [
                              '>1% in CN',
                              'last 4 versions',
                              'ie >= 8',
                            ],
                            flexbox: 'no-2009',
                          }),
                        ],
                      },
                    },
                    "less-loader"]
          })
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: {loader:'raw-loader'}
      },

      {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: "url-loader?limit=8192&name=static/css/[name].[ext]"
      }, 
      {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use:{ loader: "url-loader" }
      },
      {
        test: /\.(png|jpg|gif|md)$/,
        use:['file-loader?limit=8192&name=/static/img/[name].[hash:8].[ext]']
        // use: ['file-loader?limit=8192&name=[md5:hash:base64:10].[ext]']
      }, 
      /*
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: path.posix.join(config.build.assetsSubDirectory, 'img/[name].[hash:7].[ext]')
        }
      }, 
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: path.posix.join(config.build.assetsSubDirectory, 'fonts/[name].[hash:7].[ext]')
        }
      }
      */
    ]
  },

};