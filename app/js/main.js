var request = require("request");


AV.initialize('RI9y3H5x69wdwmC6Nw1J9erS-gzGzoHsz', 'nflt3xUGTePUKx6aBcvAwpf2');
new Vue({
    el: "#app",
    created: function () {
        this.initData(null);
    },
    data: {
        currentDay: '',
        totalCount: 9999,
        todayCount: 9999,
        yesterdayCount: 9999,
        articles: [],
        currentArticle: '',
        currentUrl: 'http://hanks.xyz',
    },
    methods: {
        initData: function (cur) {
            var today;
            if (cur) {
                today = new Date(cur);
            } else {
                today = new Date();
            }
            this.currentDay = this.formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
            this.getArticlesByDay(this.currentDay, this);
            var that = this;
            // 总文章个数
            var query0 = new AV.Query('Article');
            query0.count().then(function (count) {
                that.totalCount = count;
            }, function (error) {
                that.totalCount = 9999;
            });

            // 今天文章个数
            var query1 = new AV.Query('Article');
            query1.addDescending('createdAt');
            query1.greaterThan('createdAt', new Date(this.getLessDate(this.currentDay)));
            query1.lessThan('createdAt', new Date(this.getGaeaterDate(this.currentDay)));
            query1.count().then(function (count) {
                that.todayCount = count;
            }, function (error) {
                that.todayCount = 9999;
            });

            // 本周文章个数
            var query2 = new AV.Query('Article');
            query2.addDescending('createdAt');
            query2.greaterThan('createdAt', new Date(this.getYesterday(this.currentDay)));
            query2.lessThan('createdAt', new Date(this.getGaeaterDate(this.currentDay)));
            query2.count().then(function (count) {
                that.yesterdayCount = count;
            }, function (error) {
                that.yesterdayCount = 9999;
            });
        },
        fetchHtml: function (articleUrl) {
            var options = {
                method: 'GET',
                url: articleUrl,
                headers: { 'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.23 Mobile Safari/537.36' }
            };
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                this.currentArticle = body;
                console.log(body);
            });
        },
        getArticlesByDay: function (currentDay, theModel) {
            var that = theModel;
            var query = new AV.Query('Article');
            query.addDescending('createdAt');
            query.greaterThan('createdAt', new Date(this.getLessDate(this.currentDay)));
            query.lessThan('createdAt', new Date(this.getGaeaterDate(this.currentDay)));
            query.find().then(function (results) {
                // 处理返回的结果数据
                that.articles.length = 0;
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
        getLessDate: function (currentDate) {
            return currentDate + " 00:00:00";
        },
        getGaeaterDate: function (currentDate) {
            var today = new Date(currentDate);
            today.setDate(today.getDate() + 1);
            return this.formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate()) + " 00:00:00";
        },
        getYesterday: function (currentDate) {
            var today = new Date(currentDate);
            today.setDate(today.getDate() - 1);

            return this.formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate()) + " 00:00:00";
        },
        getNext: function (dateStr) {
            var d = new Date(dateStr);
            d.setDate(d.getDate() + 1);
            this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, d.getDate()));
        },
        getPre: function (dateStr) {
            var d = new Date(dateStr);
            d.setDate(d.getDate() - 1);
            this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, d.getDate()));
        },
        fetchArticles: function (dateStr) {
        },
        // 返回 类似 2016-01-02 格式的字符串
        formatDate: function (year, month, day) {
            var y = year;
            var m = month;
            if (m < 10) m = "0" + m;
            var d = day;
            if (d < 10) d = "0" + d;
            return y + "-" + m + "-" + d
        },
        changeArticle: function (index) {
            var that = this;
            var article = that.articles[index];
            console.log(article.article_url);
            that.currentUrl = article.article_url;
            this.fetchHtml(that.currentUrl);
        },
    }
});