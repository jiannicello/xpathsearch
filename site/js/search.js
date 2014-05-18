var search = null;

(function () {
    if(!window.console) {
        window.console = {};
        
        if(!window.console.log) {
            window.console.log = function () {};
        }
    }
    if(!window.console.group) {
        window.console.group = function () {};
        window.console.groupEnd = function () {};
    }
    

    function Search() {
        console.log('Search');
        
        this.ui = {
            btnDownload: $('#btnDownload'),
            btnSearch: $('#btnSearch'),
            ddl: $('#ddlSource'),
            formDownload: $('#formDownload'),
            results: $('#divResults'),
            txtNamespace: $('#txtNamespace'),
            txtSearch: $('#txtSearch'),
            txtSort: $('#txtSort')
        };
    }
    Search.prototype = {
        bindUI: function () {
            console.log('Search bindUI');
            var ui = this.ui;

            ui.btnDownload.on('click', $.proxy(this.onBtnDownloadClick, this));
            ui.btnSearch.on('click', $.proxy(this.onBtnSearchClick, this));
        },
        ajaxGetDdl: function () {
            console.log('Search ajaxGetDdl');
            $.ajax(
                {
                    url: '/?get_ddl_sources=1',
                    dataType: 'json',
                    success: $.proxy(this.onGetDdlAjax, this),
                    error: function () {
                        console.log('error in ajax call');
                    }
                }
            );
        },
        onGetDdlAjax: function (o) {
            console.log('Search onGetDdlAjax');
            var ddl = this.ui.ddl,
                btnSearch = this.ui.btnSearch;

            $.each(o, function () {
                ddl.append('<option value="' + this.value + '">' + this.text + '</option>');
            });

            btnSearch.prop('disabled', false);
        },
        onBtnDownloadClick: function (e) {
            console.log('Search onBtnDownloadClick');
            var ui = this.ui,
                hiddenData = ui.formDownload.find('#data');
                getJSONString = function () {
                    var tbl = $('.table'),
                        trL = tbl.find('tr'),
                        data = {
                            header: [],
                            rows: []
                        },
                        getHeader = function (tr) {
                            var thL = $(tr).find('th'),
                                header = [];

                            $.each(thL.slice(1), function () {
                                header.push($(this).html());
                            });

                            return header;
                        },
                        getRow = function (tr) {
                            var tdL = $(tr).find('td'),
                                row = [];

                            $.each(tdL.slice(1), function () {
                                row.push($(this).html());
                            });

                            return row;
                        };

                    $.each(trL, function (index, tr) {
                        var header = null;
                        
                        if (index === 0) {
                            header = getHeader(tr);
                            
                            if(header.length > 0) {
                                data.header = header;
                            } else {
                                data.rows.push(getRow(tr));
                            }
                        } else {
                            data.rows.push(getRow(tr));
                        }
                    });


                    return JSON.stringify(data);
                };

            e.preventDefault();
            
            hiddenData.prop('value', getJSONString());
            ui.formDownload.submit();
        },
        onBtnSearchClick: function (e) {
            console.log('Search onBtnSearchClick');
            var ui = this.ui,
                getSheetURL = function () {
                    var sb = ['xslt/search.xsl?xpath=', encodeURI(ui.txtSearch.val())],
                        sort = $.trim(ui.txtSort.val()),
                        namespace = $.trim(ui.txtNamespace.val());

                    if (sort) {
                        sb.push('&sort=');
                        sb.push(encodeURI(sort));
                    }
                    
                    if (namespace) {
                        sb.push('&namespace=');
                        sb.push(encodeURI(namespace));
                    }

                    return sb.join('');
                },
                xsl = null,
                xml = null,
                proc = null,
                sheetURL = null;

            e.preventDefault();
            
            $(ui.btnSearch).button('loading');
            ui.btnDownload.prop('disabled', true);
            
            ui.results.empty();
            
            sheetURL = getSheetURL();
            console.log('sheetURL: ' + sheetURL);
            xsl = Saxon.requestXML(sheetURL);
            xml = Saxon.requestXML(ui.ddl.find('option:selected').prop('value'));
            proc = Saxon.newXSLT20Processor(xsl);
            
            proc.setSuccess(function () {
                $(ui.btnSearch).button('reset');
                ui.btnDownload.prop('disabled', false);
            });
            
            
            proc.updateHTMLDocument(xml);
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
