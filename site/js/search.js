var search = null;

(function () {
    function Search() {
        console.log('Search');

        this.ui = {
            btnDownload: $('#btnDownload'),
            btnSearch: $('#btnSearch'),
            ddl: $('#ddlSource'),
            formDownload: $('#formDownload'),
            results: $('#divResults'),
            txtSearch: $('#txtSearch'),
            txtSort: $('#txtSort')
        };
    }

    Search.prototype = {
        ajaxGetDdl: function () {
            console.log('Search ajaxGetDdl');

            $.ajax({
                url: '?get_ddl_sources=1',
                dataType: 'json',
                success: $.proxy(this.onGetDdlAjax, this),
                error: function () {
                    console.error('error in ajax call');
                }
            });
        },
        bindUI: function () {
            console.log('Search bindUI');
            var ui = this.ui;

            //ui.btnDownload.on('click', $.proxy(this.onBtnDownloadClick, this));
            ui.btnSearch.on('click', $.proxy(this.onBtnSearchClick, this));
        },
        onBtnSearchClick: function (e) {
            console.log('Search onBtnSearchClick');
            var ui = this.ui,
                getSheetURL = function () {
                    var sb = ['xslt/search.xsl?xpath=', encodeURI(ui.txtSearch.val())],
                        sort = $.trim(ui.txtSort.val());

                    if (sort) {
                        sb.push('&sort=');
                        sb.push(encodeURI(sort));
                    }

                    return sb.join('');
                },
                xsl = null,
                xml = null,
                proc = null;

            e.preventDefault();

            $(ui.btnSearch).button('loading');
            ui.btnDownload.prop('disabled', true);

            ui.results.empty();

            xsl = Saxon.requestXML(getSheetURL());
            xml = Saxon.requestXML(ui.ddl.find('option:selected').prop('value'));
            proc = Saxon.newXSLT20Processor(xsl);

            proc.setSuccess(function () {
                $(ui.btnSearch).button('reset');
                ui.btnDownload.prop('disabled', false);
            });

            proc.updateHTMLDocument(xml);
        },
        onGetDdlAjax: function (o) {
            console.log('Search onGetDdlAjax');
            var ddl = this.ui.ddl,
                btnSearch = this.ui.btnSearch;

            $.each(o, function () {
                ddl.append('<option value="' + this.value + '">' + this.text + '</option');
            });

            btnSearch.prop('disabled', false);
        },
        render: function () {
            console.group('Search render');

            this.bindUI();
            this.setSaxonErrorHandler();

            this.ajaxGetDdl();
            console.groupEnd();
        },
        setSaxonErrorHandler: function () {
            console.log('Search setSaxonErrorHandler');
            var ui = this.ui;

            Saxon.setErrorHandler(function (err) {
                alert(err.message);

                $(ui.btnSearch).button('reset');
                ui.btnDownload.prop('disabled', false);
            });
        }
    };

    onSaxonLoad = function () {
        console.log('onSaxonLoad');
        search = new Search();
        search.render();
    };

}());