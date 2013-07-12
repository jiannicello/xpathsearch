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
        onGetDdlAjax: function (o) {
            console.log('Search onGetDdlAjax');
            var ddl = this.ui.ddl,
                btnSearch = this.ui.btnSearch;
                
            $.each(o, function () {
                ddl.append('<option value="' + this.value + '">' + this.text + '</option');
            });
        },
        render: function () {
            console.group('Search render');
            
            //this.bindUI();
            //this.setSaxonErrorHandler();
            
            this.ajaxGetDdl();
            console.groupEnd();
        }
    };
    
    onSaxonLoad = function () {
        console.log('onSaxonLoad');
        search = new Search();
        search.render();
    }
    
} ());