const path = require('path');

module.exports = {
	module: {
		rules: [
			{
				test: /\.(sc|c)ss$/,
				loaders: [ {
					loader: 'style-loader',
					options: {
					  insertInto: (a,b) =>  {
						const selector = document.querySelector("#root").parentElement;
						console.log(selector)
						return selector
					  },
					  attrs: {
						  id: "scssStyle"
					  }
					},
				  }, 'css-loader', 'sass-loader' ],
				include: path.resolve(__dirname, '../')
			}
		]
	}
};
