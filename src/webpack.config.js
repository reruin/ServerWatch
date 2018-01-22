//坑 http://blog.csdn.net/paranoidyang/article/details/72898070

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

const prod = process.env.NODE_ENV === 'production';


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

    //设置模块别名
    /*alias:{
      angular:path.resolve(__dirname,"node_modules/angular/angular.min.js"),
      "angular-animate":path.resolve(__dirname,"node_modules/angular-animate/angular-animate.min.js"),
      "angular-route":path.resolve(__dirname,"node_modules/angular-route/angular-route.min.js"),
      "angular-resource":path.resolve(__dirname,"node_modules/angular-resource/angular-resource.min.js"),
      jquery:path.resolve(__dirname,"node_modules/jquery/dist/jquery.min.js")
    }*/
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
      filename:prod ?'static/js/[name].[hash].js':'[name].js',
      path: path.join(__dirname, 'build'),
      // 指定资源文件引用的目录，也就是说用/assests/这个路径指代path，开启这个配置的话，index.html中应该要引用的路径全部改为'/assets/...'
      // publicPath:  'build',
      chunkFilename:prod ? 'static/js/[name].[hash].js': '[name].js'
  },


  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        minChunks:2,
    }),
    new ExtractTextPlugin(prod ? 'static/css/[name].[contenthash:8].css' : 'styles.css'),
    
    new webpack.HotModuleReplacementPlugin(),
    /*new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })*/
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
              use: [{
                      loader: 'css-loader',
                      options:{
                          minimize: true //css压缩
                      }
                  },{
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
                  },"less-loader"]
          })
      },
      
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: {loader:'raw-loader'}
      },

      {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "url-loader?limit=8192"
      }, 
      {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use:{ loader: "url-loader" }
      },
      {
        test: /\.(png|jpg|gif|md)$/,
        use:['file-loader']
        // use: ['file-loader?limit=8192&name=[md5:hash:base64:10].[ext]']
      }, 
    ]
  },

  // 使用 webpack-dev-server 时，HtmlWebpackPlugin 不会将文件生成到实际目录中
  // https://gist.github.com/ampedandwired/becbbcf91d7a353d6690
  devServer: {//webpack-dev-server配置热更新以及跨域
        historyApiFallback: true,//不跳转
        noInfo: true,
        inline: true,//实时刷新
        port: '4000',
        hot:true,
        contentBase: './',
        
        proxy: {
          '/api/*': {
           target: 'http://localhost:3001',
           changeOrigin: true,
           secure: false
          }
        }
        
    },
};