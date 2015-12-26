require("./js/lib.entry");
const {IndexRoute, Route} = ReactRouter;

//=====================================================
$.TOUCH_DEVICE = function () {
	var result = (("ontouchstart" in window) || (navigator.msMaxTouchPoints > 0));
	return !!result;
}();

//=====================================================
//Vector
window.DEVICE = ["phone", "tablet", "desktop"];

//===============================================
if ($.TOUCH_DEVICE) {
	$("html").addClass("touch");
}

//=============================================
let DeviceList = [
	{name: "phone", breakpoint: 640},
	{name: "tablet", breakpoint: 960},
	{name: "desktop", breakpoint: Infinity}
];

//===============================PRELOAD ASSETS==============
require.ensure([], function (require) {
	var MediaStore = require("js/media");
	var ImgLoaded = Immutable.fromJS([]);
	var PreloadList = require("js/bag-store/bag-data").ImageList;

	PreloadList.map(function (img, index) {
		function requested() {
			ImgLoaded = ImgLoaded.push(img);
			console.log(ImgLoaded.size, PreloadList.size);
			if (ImgLoaded.size == PreloadList.size) {
				MediaStore.actions.imagesLoaded();
			}
		}

		var _img = (new Image());
		_img.onerror = requested;
		_img.onload = requested;
		return _img.src = require("./img" + img);
	});
});

//===============================APP==============
$(()=>{

	$(document.body).append(`<div id="app"></div>`);

	require.ensure([], function (require) {
		var {Router,Route,IndexRoute}= ReactRouter;
		var Device = require("js/components/device");
		var MasterPage = require("js/pages/master.js"),
				IndexPage = require("js/pages/index.js"),
				SubmitPage = require("js/pages/submit.js");

		ReactDOM.render(
				<Device className="v-coach-app"
								device={DeviceList}>
					<Router history={History.createHistory()}>
						<Route path="/" component={MasterPage}>
							<IndexRoute component={IndexPage}/>
							<Route path="/bag/:size" component={IndexPage}>
								<Route path="submit" component={SubmitPage}>
								</Route>
							</Route>
						</Route>
					</Router>
				</Device>
				, document.getElementById("app"));

	});
});
