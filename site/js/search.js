﻿var search = null;

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

            ui.btnDownload.on('click', $.proxy(this.onBtnDownloadClick, this));
            ui.btnSearch.on('click', $.proxy(this.onBtnSearchClick, this));
        },
        onBtnDownloadClick: function (e) {
            console.log('Search onBtnDownloadClick');
            var ui = this.ui,
                hiddenData = ui.formDownload.find('#data'),
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
                    
                    
                    $.each(trL, function(index, tr) {
                        var header = null;
                        
                        if (index === 0) {
                            header = getHeader(tr);
                            
                            if (header.length > 0) {
                                data.header = header;
                            } else {
                                data.rows.push(getRow(tr));
                            }
                        } else {
                            data.rows.push(getRow(tr));
                        }
                    });
                    
                    return JSON.stringify(data);
                }; //end getJSONString
                
            e.preventDefault();
            
            hiddenData.prop('value', getJSONString());
            ui.formDownload.submit();
        },
        onBtnSearchClick: function (e) {
            console.log('Search onBtnSearchClick');
            var ui = this.ui,
                ddlSelectedValue = encodeURI(ui.ddl.find('option:selected').prop('value')),
                getSheetURL = function () {
                    var sb = ['xslt/search.xsl?xpath=', encodeURI(ui.txtSearch.val())],
                        sort = $.trim(ui.txtSort.val());
                    
                    sb.push('&source=');
                    sb.push(ddlSelectedValue);
                        
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
            xml = Saxon.requestXML(ddlSelectedValue);
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
            console.log('Search render');

            this.bindUI();
            this.setSaxonErrorHandler();

            this.ajaxGetDdl();
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