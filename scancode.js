/* 
 示例：
 scancode({
     btn:$('#search_scans'),  //打开扫码的按钮
     input:$('#assetTableSearch'), //扫码内容写入的input 可选
     callback:function(code){  //扫码成功回调  可选
        console.log(code)
     }
    })
 */

    (function(global){
        global.scancode = function(opt){
            return new ScanCode(opt);
        }
        function ScanCode(opt){
            this.init(opt);
        }
        ScanCode.prototype = {
            constructor: ScanCode,
            //扫码识别将内容展示到输入框内  opt是对象  btn:按钮名称  input:输入框 callback:返回数据
            init: function(opt){
                this.opt = opt
                this.addDom()  //添加dom元素
                this.addCss()   //添加class元素
                this.addEvent()   //添加事件
                this.closeScan()  //初始化关闭事件
                this.addLocalGallery()  //调取本地图库
            },
            addLocalGallery:function (){
                $('#scan_bendi_pic').on('click',function (){
                    $('#scan_bendi').click()
                })
            },
            addDom:function (){
                if($('#scan_code_scaner').length === 0){
                    var html = '<div id="scan_code_scaner">' 
                        +'<i  id="scan_code_close_icon"></i>'
                        +'<div id="scan_code_banner"><p >若当前浏览器无法扫码，请切换其他浏览器尝试</p></div>'
                        +'<div class="scan_code_cover">\n' +
                        '      <p class="scan_code_line"></p>\n' +
                        '      <span class="scan_code_square_top_left"></span>\n' +
                        '      <span class="scan_code_square_top_right"></span>\n' +
                        '      <span class="scan_code_square_bottom_right"></span>\n' +
                        '      <span class="scan_code_square_bottom_left"></span>\n' +
                        '      <p class="scan_code_tips">将二维码放入框内，即可自动扫描</p>\n' +
                        '    </div>'
                        +' <video\n' +
                        '        id="scan_code_video"\n' +
                        '        width="100%"\n' +
                        '        height="100%"\n' +
                        '        controls\n' +
                        '    ></video>'
                        +'<canvas id="scan_code_canvas"/>'
                        +'<div id="scan_bendi_pic"></div>' //如果不想扫码 可点击图库 扫图库里面的二维码
                        +'<input type="file" id="scan_bendi" ></input>'
                        +'</div>'
                    $('body').append(html);
                }
            },
            addCss:function (){
                if($('.scan-code-css').length===0){
                    var css = '<style class="scan-code-css">'
                        +'#scan_code_scaner{display: none;background: #000000;position: fixed;top: 0;left: 0; width: 100%;height: 100%;}'
                        +'#scan_code_scaner #scan_code_banner{ width: 340px;position: absolute;top: 10%; left: 50%;margin-left: -170px;background: #FA74A2;border-radius: 8px;box-sizing: border-box;padding: 12px;opacity: 0.9;box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);}'
                        +'#scan_code_scaner #scan_code_banner p{  padding: 0;\n' +
                        '        margin: 0;\n' +
                        '        color: #FFFFFF;\n' +
                        '        font-size: 12px;\n' +
                        '        text-align: justify;\n' +
                        '        text-align-last: left;}'
                        +'#scan_code_close_icon{display: inline-block;\n' +
                        '        height: 24px;\n' +
                        '        width: 24px;\n' +
                        '        background: url("data:image/svg+xml;charset=utf-8,%3Csvg t=\'1678697006161\' class=\'icon\' viewBox=\'0 0 1024 1024\' version=\'1.1\' xmlns=\'http://www.w3.org/2000/svg\' p-id=\'14211\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' width=\'16\' height=\'16\'%3E%3Cpath d=\'M512 66.4c-244.6 0-444.8 200.2-444.8 444.8S267.4 956 512 956s444.8-200.2 444.8-444.8S756.6 66.4 512 66.4z m0 815.5c-207.6 0-370.7-163.1-370.7-370.7S304.4 140.5 512 140.5s370.7 163.1 370.7 370.7S719.6 881.9 512 881.9z\' fill=\'%23ffffff\' p-id=\'14212\'%3E%3C/path%3E%3Cpath d=\'M636.6 695.4L335.3 394.2c-13.8-13.8-13.8-36.5 0-50.3l1.1-1.1c13.8-13.8 36.5-13.8 50.3 0L688 644c13.8 13.8 13.8 36.5 0 50.3l-1.1 1.1c-13.9 13.9-36.5 13.9-50.3 0z\' fill=\'%23ffffff\' p-id=\'14213\'%3E%3C/path%3E%3Cpath d=\'M333 644.2l301.3-301.3c13.8-13.8 36.5-13.8 50.3 0l1.1 1.1c13.8 13.8 13.8 36.5 0 50.3L384.4 695.6c-13.8 13.8-36.5 13.8-50.3 0l-1.1-1.1c-13.8-13.8-13.8-36.4 0-50.3z\' fill=\'%23ffffff\' p-id=\'14214\'%3E%3C/path%3E%3C/svg%3E") no-repeat center;\n' +
                        '        background-size: auto 100%;\n' +
                        '        position: absolute;\n' +
                        '        right: 10px;\n' +
                        '        top: 15px;}'
                        +'#scan_code_scaner .scan_code_cover{height: 220px;\n' +
                        '        width: 220px;\n' +
                        '        position: absolute;\n' +
                        '        top:50%;\n' +
                        '        left:50%;\n' +
                        '        -webkit-transform: translate(-50%,-50%);\n' +
                        '        -moz-transform: translate(-50%,-50%);\n' +
                        '        -ms-transform: translate(-50%,-50%);\n' +
                        '        -o-transform: translate(-50%,-50%);\n' +
                        '        transform: translate(-50%,-50%);\n' +
                        '        border: .5px solid #999999;\n' +
                        '        z-index: 1111;}'
                        +'#scan_code_scaner .scan_code_cover .scan_code_line{ width: 200px;\n' +
                        '        height: 1px;\n' +
                        '        margin-left: 10px;\n' +
                        '        background: #5F68E8;\n' +
                        '        background: linear-gradient(to right, transparent, #5F68E8, #0165FF, #5F68E8, transparent);\n' +
                        '        position: absolute;\n' +
                        '        -webkit-animation: scan 1.75s infinite linear;\n' +
                        '        -moz-animation: scan 1.75s infinite linear;\n' +
                        '        -ms-animation: scan 1.75s infinite linear;\n' +
                        '        -o-animation: scan 1.75s infinite linear;\n' +
                        '        animation: scan 1.75s infinite linear;\n' +
                        '        -webkit-animation-fill-mode: both;\n' +
                        '        -moz-animation-fill-mode: both;\n' +
                        '        -ms-animation-fill-mode: both;\n' +
                        '        -o-animation-fill-mode: both;\n' +
                        '        animation-fill-mode: both;\n' +
                        '        border-radius: 1px;}'
                        +'#scan_code_scaner .scan_code_cover .scan_code_square_top_left{display: inline-block;\n' +
                        '        height: 20px;\n' +
                        '        width: 20px;\n' +
                        '        position: absolute;\n' +
                        '        top: 0;\n' +
                        '        left: 0;\n' +
                        '        border-left: 1px solid #5F68E8;\n' +
                        '        border-top: 1px solid #5F68E8;}'
                        +'#scan_code_scaner .scan_code_cover .scan_code_square_top_right{display: inline-block;\n' +
                        '        height: 20px;\n' +
                        '        width: 20px;\n' +
                        '        position: absolute;\n' +
                        '        top: 0;\n' +
                        '        right: 0;\n' +
                        '        border-right: 1px solid #5F68E8;\n' +
                        '        border-top: 1px solid #5F68E8;}'
                        +'#scan_code_scaner .scan_code_cover .scan_code_square_bottom_right{display: inline-block;\n' +
                        '        height: 20px;\n' +
                        '        width: 20px;\n' +
                        '        position: absolute;\n' +
                        '        bottom: 0;\n' +
                        '        right: 0;\n' +
                        '        border-right: 1px solid #5F68E8;\n' +
                        '        border-bottom: 1px solid #5F68E8;}'
                        +'#scan_code_scaner .scan_code_cover  .scan_code_square_bottom_left{display: inline-block;\n' +
                        '        height: 20px;\n' +
                        '        width: 20px;\n' +
                        '        position: absolute;\n' +
                        '        bottom: 0;\n' +
                        '        left: 0;\n' +
                        '        border-left: 1px solid #5F68E8;\n' +
                        '        border-bottom: 1px solid #5F68E8;}'
                        +'#scan_code_scaner .scan_code_cover .scan_code_tips{' +
                        'position: absolute;\n' +
                        '        bottom: -48px;\n' +
                        '        width: 100%;\n' +
                        '        font-size: 14px;\n' +
                        '        color: #FFFFFF;\n' +
                        '        opacity: 0.8;}'
                        +'#scan_code_video{display: none;}'
                        +'@-webkit-keyframes scan{0% {top: 0}\n' +
                        '        25% {top: 50px}\n' +
                        '        50% {top: 100px}\n' +
                        '        75% {top: 150px}\n' +
                        '        100% {top: 200px}}'
                        +'@-moz-keyframes scan{ 0% {top: 0}\n' +
                        '        25% {top: 50px}\n' +
                        '        50% {top: 100px}\n' +
                        '        75% {top: 150px}\n' +
                        '        100% {top: 200px}}'
                        +'@-o-keyframes scan{0% {top: 0}\n' +
                        '        25% {top: 50px}\n' +
                        '        50% {top: 100px}\n' +
                        '        75% {top: 150px}\n' +
                        '        100% {top: 200px}}'
                        +'@keyframes scan{0% {top: 0}\n' +
                        '        25% {top: 50px}\n' +
                        '        50% {top: 100px}\n' +
                        '        75% {top: 150px}\n' +
                        '        100% {top: 200px}}'
                        +'#scan_bendi_pic{' +
                        '        background: url("data:image/svg+xml;charset=utf-8,%3Csvg t=\'1678781826211\' class=\'icon\' viewBox=\'0 0 1024 1024\' version=\'1.1\' xmlns=\'http://www.w3.org/2000/svg\' p-id=\'33273\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' width=\'16\' height=\'16\'%3E%3Cpath d=\'M307.0194 136.051734c-56.587889 0-102.3398 45.751911-102.3398 102.3398 0 56.587889 45.751911 102.3398 102.3398 102.3398 56.587889 0 102.3398-45.751911 102.3398-102.3398C409.3592 181.803645 363.60729 136.051734 307.0194 136.051734zM307.0194 272.103469c-18.661964 0-34.313933-15.049971-34.313933-34.313933 0-18.661964 15.049971-34.313933 34.313933-34.313933 18.661964 0 34.313933 15.049971 34.313933 34.313933C341.333333 257.053498 326.283363 272.103469 307.0194 272.103469z\' p-id=\'33274\' fill=\'%23ffffff\'%3E%3C/path%3E%3Cpath d=\'M705.542622 567.684891l-127.021752 125.215755c0 0-0.601999 0-0.601999 0.601999-10.23398 10.23398-10.23398 25.885949 0 36.119929 10.23398 10.23398 25.885949 10.23398 36.119929 0 0.601999-0.601999 0.601999-1.805996 1.805996-2.407995l76.453851-76.453851 36.119929-36.119929c0 0 24.681952 23.477954 25.283951 22.875955 9.631981 4.213992 21.069959 3.009994 28.895944-4.815991 10.23398-10.23398 10.23398-25.885949 0-36.119929l-18.059965-18.059965c0 0-3.611993-3.611993-5.417989-5.417989C744.672546 558.05291 722.398589 556.246914 705.542622 567.684891z\' p-id=\'33275\' fill=\'%23ffffff\'%3E%3C/path%3E%3Cpath d=\'M807.882422 693.502646l11.437978 11.437978c10.23398 10.23398 25.885949 10.23398 36.119929 0 10.23398-10.23398 10.23398-25.885949 0-36.119929l-11.437978-11.437978 0 0c0 0 0-0.601999-0.601999-0.601999-10.23398-10.23398-25.885949-10.23398-36.119929 0C797.046443 667.014697 797.046443 683.268665 807.882422 693.502646 807.280423 693.502646 807.280423 693.502646 807.882422 693.502646z\' p-id=\'33276\' fill=\'%23ffffff\'%3E%3C/path%3E%3Cpath d=\'M951.158142 92.10582l-0.601999 0.601999c-3.009994 6.019988-4.213992 12.039976-3.611993 18.661964 4.213992 55.383892 7.223986 348.557319 7.825985 468.957084 0 18.059965-22.273956 27.089947-34.915932 13.845973l-146.887713-157.723692c-6.621987-15.049971-21.671958-25.885949-39.129924-25.885949-15.651969 0-29.497942 8.427984-36.721928 21.069959l-249.227513 249.227513c-7.223986 5.417989-7.223986 5.417989-15.049971 0L291.367431 565.276896c-7.825985-10.23398-19.865961-17.457966-34.313933-17.457966-7.223986 0-13.845973 1.805996-19.865961 4.815991l-6.621987 4.213992c-2.407995 1.805996-4.213992 3.611993-6.019988 5.417989l-157.121693 150.499706L67.423868 136.653733c0-37.925926 30.70194-68.025867 68.025867-68.025867 0 0 627.282775 1.203998 754.304527 4.213992 13.845973 0 25.885949-7.223986 32.507937-19.865961l0.601999-0.601999c11.437978-22.875955-4.213992-50.567901-29.497942-51.771899-1.805996 0-4.213992 0-6.019988 0L136.653733 0.601999C61.40388 0 0 60.801881 0 136.653733l0 750.692534c0 75.249853 61.40388 136.653733 136.653733 136.653733l750.692534 0c75.249853 0 136.653733-61.40388 136.653733-136.653733L1024 136.653733c0-13.243974-1.805996-25.885949-5.417989-37.925926C1009.552028 66.821869 966.208113 62.607878 951.158142 92.10582zM955.974133 887.346267c0 37.925926-30.70194 68.025867-68.025867 68.025867L136.653733 955.372134c-37.925926 0-68.025867-30.70194-68.025867-68.025867L68.627866 806.678424l181.803645-173.97766c6.019988-5.417989 10.23398-5.417989 16.253968 0l139.663727 114.379777c12.039976 8.427984 25.283951 18.661964 35.517931 18.661964s22.273956-3.611993 35.517931-16.855967l253.441505-253.441505c1.203998 0 2.407995 0.601999 4.213992 0.601999 0.601999 0 0.601999 0 1.203998 0l220.33157 236.585538L956.576132 887.346267z\' p-id=\'33277\' fill=\'%23ffffff\'%3E%3C/path%3E%3C/svg%3E");\n' +
                        '        background-size: auto 100%;\n' +
                        'position: absolute;\n' +
                        'width: 20px;\n' +
                        'height: 20px;'+
                        'bottom: 15px;\n' +
                        'left: 15px;}'+
                        '#scan_bendi{' +
                        'position: absolute;\n' +
                        '    left: -2000px;\n' +
                        '    bottom: 0px;}'
                        +'</style>';
                    $('body').append(css);
                }
            },
            addEvent:function (){
                var obj = {};
                this.obj = obj
                var _this = this;
                this.opt.btn.on('click',function (){
                    $('#scan_code_scaner').show()
                    // 判断了浏览器是否支持挂载在MediaDevices.getUserMedia()的方法
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                        obj.lineColor='#03C03C';
                        obj.code = '';
                        obj.lineWidth = 2;
                        obj.previousCode = null;
                        obj.drawOnfound = true;
                        obj.parity = 0;
                        obj.active = true;
                        obj.useBackCamera = true
                        obj.canvas = document.getElementById('scan_code_canvas')
                        obj.scan_code_video =  document.getElementById('scan_code_video')
                        obj.canvas_getContext = document.getElementById('scan_code_canvas').getContext("2d");
                        // 获取摄像头模式，默认设置是后置摄像头
                        const facingMode = obj.useBackCamera ? { exact: 'environment' } : 'user';
                        // 摄像头视频处理
                        const handleSuccess = stream => {
                            if (obj.scan_code_video.srcObject !== undefined) {
                                obj.scan_code_video.srcObject = stream;
                            } else if (window.videoEl && window.videoEl.mozSrcObject !== undefined) {
                                obj.scan_code_video.mozSrcObject = stream;
                            } else if (window.URL && window.URL.createObjectURL) {
                                obj.scan_code_video.src = window.URL.createObjectURL(stream);
                            } else if (window.webkitURL) {
                                obj.scan_code_video.src = window.webkitURL.createObjectURL(stream);
                            } else {
                                obj.scan_code_video.src = stream;
                            }
                            // 不希望用户来拖动进度条的话，可以直接使用playsinline属性，webkit-playsinline属性
                            obj.scan_code_video.playsInline = true;
                            var playPromise = obj.scan_code_video.play();
                            playPromise.catch(() => {
                                $('#scan_code_video').show()
                                $('#scan_code_canvas').hide()
                            });
    
                            // 视频开始播放时进行周期性扫码识别
                            playPromise.then(()=>{
                                _this.run()
                            });
                        };
                        // 捕获视频流
                        navigator.mediaDevices
                            .getUserMedia({ video: { facingMode } })
                            .then(handleSuccess)
                            .catch(() => {
                                navigator.mediaDevices
                                    .getUserMedia({ video: true })
                                    .then(handleSuccess)
                                    .catch(error => {
                                        console.log(error)
                                    });
                            });
                    }
                })
                $('#scan_bendi').on('change',function (event){
                    var docObj = document.getElementById("scan_bendi");
                    console.log(44444,docObj.files[0])
                    var URL = window.URL || window.webkitURL; // 兼容
                    var img = new Image();  // 创建图片对象
                    img.src = URL.createObjectURL(docObj.files[0]);//创建Image的对象的url
                    img.onload = function () {
                        // console.log(22222222,'height:'+this.height+'----width:'+this.width)
                        _this.obj.canvas.width = this.width;
                        _this.obj.canvas.height =this.height;
                        URL.revokeObjectURL(img.src);
                        _this.obj.canvas_getContext.drawImage(img, 0, 0, this.width, this.height)
                        var imageData =  _this.obj.canvas_getContext.getImageData( 0, 0, this.width, this.height)
                        var code = jsQR(imageData.data, imageData.width, imageData.height);
                        console.log("Found QR code", code);
                        if(code.data){
                            obj.code = code.data
                            if(_this.opt.input){
                                $(_this.opt.input).val(obj.code)
                            }
                            if(_this.opt.callback){
                                _this.opt.callback(code)
                            }
                            $('#scan_code_scaner').hide()
                            _this.obj.scan_code_video.srcObject.getTracks().forEach(t => t.stop());
                        }
                    }
                })
            },
            closeScan:function (){
                $(document).on('click','#scan_code_close_icon',function (){
                    $('#scan_code_scaner').hide()
                })
            },
            drawLine:function (begin, end){
                var obj = this.obj
                obj.canvas_getContext.beginPath();
                obj.canvas_getContext.moveTo(begin.x, begin.y);
                obj.canvas_getContext.lineTo(end.x, end.y);
                obj.canvas_getContext.lineWidth = obj.lineWidth;
                obj.canvas_getContext.strokeStyle = obj.lineColor;
                obj.canvas_getContext.stroke();
            },
            run:function() {
                var obj = this.obj
                if (obj.active) {
                    requestAnimationFrame(()=>{
                        this.tick()
                    })
                }
            },
            tick:function () {
                var obj = this.obj
                if (obj.scan_code_video && obj.scan_code_video.readyState === obj.scan_code_video.HAVE_ENOUGH_DATA) {
                    obj.canvas.height = document.documentElement.clientHeight  || document.body.clientHeight;
                    obj.canvas.width = document.documentElement.clientWidth || document.body.clientWidth;
                    $('#scan_code_video').attr('height',obj.canvas.height)
                    $('#scan_code_video').attr('width',obj.canvas.width)
                    obj.canvas_getContext.drawImage(obj.scan_code_video, 0, 0, obj.canvas.width, obj.canvas.height);
                    const imageData = obj.canvas_getContext.getImageData(0, 0, obj.canvas.width, obj.canvas.height);
                    var code = false;
                    try {
                        code = jsQR(imageData.data, imageData.width, imageData.height);
    
                    } catch (e) {
                        console.error(e);
                    }
                    if (code) {
                        this.drawBox(code.location);
                        this.found(code.data);
                    }
                }
                this.run();
            },
            drawBox:function (location) {
                var obj = this.obj
                if (obj.drawOnfound) {
                    this.drawLine(location.topLeftCorner, location.topRightCorner);
                    this.drawLine(location.topRightCorner, location.bottomRightCorner);
                    this.drawLine(location.bottomRightCorner, location.bottomLeftCorner);
                    this.drawLine(location.bottomLeftCorner, location.topLeftCorner);
                }
            },
            found:function (code) {
                var obj = this.obj
                if (obj.previousCode !== code) {
                    obj.previousCode = code;
                } else if (obj.previousCode === code) {
                    obj.parity += 1;
                }
                if (obj.parity > 2) {
                    obj.active = true;
                    obj.parity = 0;
                    obj.code = code
                    if(this.opt.input){
                        $(this.opt.input).val(obj.code)
                    }
                    if(this.opt.callback){
                        this.opt.callback(code)
                    }
                    $('#scan_code_scaner').hide()
                    obj.scan_code_video.srcObject.getTracks().forEach(t => t.stop());
                }
            },
        }
    })(window)
    
    
    
    
    
    
    