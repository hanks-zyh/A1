var request = require("request");


AV.initialize('RI9y3H5x69wdwmC6Nw1J9erS-gzGzoHsz', 'nflt3xUGTePUKx6aBcvAwpf2');
var app = new Vue({
    el: "#app",
    created: function () {
        this.initData();
    },
    data: {
        articles: [],
        currentUrl: 'http://hanks.xyz',
        currentPage: 0,
        currentPlatform: '',
    },
    methods: {
        initData: function () {
            this.showHomePage();
        },
        changeArticle: function (index) {
            var that = this;
            var article = that.articles[index];
            //console.log(article.article_url);
            //const webview = document.getElementById('foo');
            that.currentUrl = article.article_url;
            // this.fetchHtml(that.currentUrl);
        },
        showHomePage: function () {
            this.currentPage = 0;
            this.currentPlatform = '';
            this.getArticlesByPlatform();
        },
        showSetting: function () {
        },

        getArticlesByPlatform: function () {
            var that = this;
            var query = new AV.Query('Article');
            var pageSize = 20;
            query.addDescending('createdAt');
            if (this.currentPlatform) {
                query.equalTo('article_from', this.currentPlatform);
            }
            query.limit(pageSize);
            query.skip(pageSize * this.currentPage);
            query.find().then(function (results) {
                // 处理返回的结果数据
                if (that.currentPage == 0) {
                    that.articles.length = 0;
                }
                that.currentPage++;
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    that.articles.push({
                        title: object.get('title'),
                        subtitle: object.get('subtitle'),
                        article_url: object.get('url'),
                        author_name: object.get('author_name'),
                        created_at: object.getCreatedAt(),
                        article_from: object.get('article_from'),
                    })
                }
            }, function (error) {
                console.log('Error: ' + error.code + ' ' + error.message);
            });
        },

        showJianshuArticle: function () {
            this.currentPage = 0;
            this.currentPlatform = 'jianshu';
            this.getArticlesByPlatform();
        },
        showCsdnArticle: function () {
            this.currentPage = 0;
            this.currentPlatform = 'csdn';
            this.getArticlesByPlatform();
        },
        showMediumArticle: function () {
            this.currentPage = 0;
            this.currentPlatform = 'medium';
            this.getArticlesByPlatform();
        },
        loadMore: function () {
            this.getArticlesByPlatform();
        },
    }
});

// 检测滑动到底部
var list = document.getElementsByClassName("article-list")[0];
if (list) {
    list.onscroll = function () {
        //console.log('......' + list.scrollTop + "," + list.scrollHeight + "," + list.clientHeight);
        if (list.scrollTop + list.clientHeight == list.scrollHeight) {
            // alert("到达底部");
            console.log("到达底部");
            app.loadMore();
        }
    }
}