$(document).ready(function () {

    initI18N();
    bindEvents();

    function initI18N() {
        var path = getCommonScriptPath();
        var lang = utils.getLanguage();
        var localPath = path + "./locales",
            file = "/resources.js";

        var filePathMap = {
            "en-US": localPath + "/en-US" + file,
            "zh-CN": localPath + "/zh-CN" + file
        };
        $.get(filePathMap[lang], function () {
            var examplesResourceURL = path + '../examples/locales/' + lang + '/resources.js';
            $.get(examplesResourceURL, function () {
                for (var name in window.webResources) {
                    var subWeb = window.webResources[name];
                    var subExamples = window.examplesResources[name];
                    //重名以webResource为准
                    if (typeof window.webResources[name] == 'object') {

                        if (!subExamples) {
                            subExamples = {};
                        }
                        for (var name1 in subWeb) {
                            subExamples[name1] = subWeb[name1];
                        }
                    } else {
                        subExamples[name1] = subWeb[name];
                    }
                }
                window.resources = window.examplesResources;
                i18next
                    .init({
                        lng: lang,
                        whitelist: ["zh-CN", "en-US"], //语言列表，跟locales下的目录名对应
                        fallbackLng: "zh-CN" //默认语言
                    }, function () {
                        i18next.addResourceBundle(lang, 'translation', window.resources);
                        localize();
                        jqueryI18next.init(i18next, $);
                        $(".nav").localize(); //翻译nav下所有的文档

                    });


                setCurrentVersion();
                resetCurrentVersionLink();
            })
        })
    };

    //设置头部版本号
    function setCurrentVersion() {
        var version = getVersion();
        if (!version && window.preRelease) {
            version = window.preRelease;
        }
        var versionText = version ? "" + version : "&nbsp;";
        $('#version').html(versionText);

    }

    //重置当前版本链接,不带版本号
    function resetCurrentVersionLink() {
        if (!window.version) {
            return;
        }
        var version = window.version;
        version = version.toString();
        $(".icl-nav-version").each(function (key, item) {
            if (item.href) {
                var reg = new RegExp("(.*)\/(" + version + ")(\/.*)");
                var match = item.href.match(reg);
                if (match && match[1] && match[3]) {
                    item.href = match[1] + match[3];
                }
            }
        });
    }

    function bindEvents() {

        $('.icl-header').on('click', '.lang-option', function () {
            var value = $(this).data('lang');
            utils && utils.setLanguage(value);

            localize();
        });

    }

    function localize() {
        var lang = utils.getLanguage();
        var pathname = window.location.pathname.replace("/", "/");
        var href = window.location.origin + pathname;
        // if (lang === "en-US") {
        //
        //     if (pathname === "/") {
        //         href = window.location.origin + "/en/web/index.html"
        //     } else {
        //         if (getVersion()) {
        //             href = window.location.origin + pathname.replace(/([^\/]*\/){1}([^\/]*)/, '$1$2/en');
        //             //href = window.location.origin + pathname.replace(/([^\/]*\/){2}([^\/]*)/, '/$1$2/en');
        //         } else if (window.isLocal) {
        //             href = window.location.origin + pathname.replace(/(([^\/]*\/){3})([^\/]*)/, '$1$3/en')
        //         } else {
        //             href = window.location.origin + pathname.replace(/([^\/]*\/){1}([^\/]*)/, '/en/$2');
        //             //href = window.location.origin + pathname.replace(/([^\/]*\/){1}([^\/]*)/, '/$2/en');
        //         }
        //
        //     }
        // }
        if ((window.location.origin + window.location.pathname) === href) {
            return;
        }
        window.location = href;
    }

    function getVersion() {
        var pathname = window.location.pathname.replace("/", "/");
        var match = pathname.match(/^\/(dev|(?:\d+\.)+\d)\/.*/); //匹配版本:dev|9.0.0
        return match && match[1] ? match[1] : null;
    }
    window.getVersion = getVersion;

    function getCommonScriptPath() {
        var r = new RegExp("(^|(.*?\\/))(common\.js)(\\?|$)"),
            s = document.getElementsByTagName('script'),
            relativePath;
        for (var i = 0; i < s.length; i++) {
            var src = s[i].getAttribute('src');
            if (src) {
                var m = src.match(r);
                if (m) {
                    relativePath = m[1] ? m[1].replace("js/", "") : "./";
                    break;
                }
            }
        }
        return relativePath;
    }

    //监听nav滚动添加背景色
    $(window).scroll(function () { //开始监听滚动条
        var top = $(document).scrollTop(); //滚动条距离顶部的高度
        if (top > 1) {
            $("#nav")[0].style.backgroundColor = "#191515";
        } else {
            $("#nav")[0].style.backgroundColor = "";
        }
    })


});
