    $(document).ready( function () {
        // $.ajax({
        //     type: 'GET',
        //     url:'http://localhost:8085/v1/organizations/',
        //     dataType: 'json',
        //     success:function(response){
        //         alert("Success");
        //         console.log(response);
        //         },
        //     error:function(response){
        //         alert("Error");
        //         console.log(response);},
        // });



        /*Popola la tabella delle Organizzazioni e il <select> element del form con il nome delle Organizzazioni*/
        $('#organizationsTable').DataTable({
            "sAjaxSource": "http://localhost:8085/v1/organizations/",
            "sAjaxDataProp": "",
            "order": [[ 1, "asc" ]],
            "columns": [
                {
                    "className": "details-control fa fa-plus-circle",
                    "orderable": false,
                    "data": null,
                    "defaultContent": ''
                },
                { "className": "orgTableId", "data": "organizationId"},
                { "className": "orgTableName", "data": "organizationName"},
                { "className": "orgTableContactName", "data": "contactName"},
                { "className": "orgTableNameContactEmail", "data": "contactEmail"},
                { "className": "orgTableNameContactPhone", "data": "contactPhone"},
            ],
            "fnInitComplete": function(oSettings, json) {
                $(json).each(function() {
                    $("#selectOrgId").append($('<option></option>').val(this["organizationId"]).html(this["organizationName"]));
                });
                $("#selectOrgId").append('<option value="New Organization" id="optNewOrg">New Organization...</option>');
            }
        });

        // Event listener for opening and closing details
        $('table#organizationsTable tbody ').on('click', 'tr td.details-control', function () {
            var selectedRow = $(this).closest('tr').removeClass();
            var companyID = $(selectedRow).find('.orgTableId').text();
            var row = $('#organizationsTable').DataTable().row( selectedRow );

            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                // selectedRow.removeClass('shown');
            }
            else {
                // Open this row
                insertChildLicenseTable(row.child , companyID);
                // selectedRow.addClass('shown');
            }
        });

        $("#insertLicenseForm").submit(function (event) {

            //stop submit the form, we will post it manually.
            event.preventDefault();

            var data = {};
            $.each($("#insertLicenseForm").serializeArray(), function (i, field) {
                data[field.name] = field.value;
            });

            data["licenseAllocated"]=1;
            data["organizationId"]=data['selectOrgId'];

            if(data["organizationId"]=="New Organization"){
                alert("Ho deciso di creare una nuova licenza e una nuova organizzazione!");
                $.ajax({
                    type: "POST",
                    url: "http://localhost:8085/v1/organizations/"+data['organizationId']+"/",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(data),
                    success: function(response) {
                        alert("OrganizeService:"+ response["organizationId"]);
                        data["organizationId"]=response["organizationId"];

                        // Inserisco la nuova licenza associata alla nuova organizzazione precedentemente creata
                        $.ajax({
                            type: "POST",
                            url: "http://localhost:8080/v1/organizations/"+response['organizationId']+"/licenses/",
                            contentType: "application/json",
                            dataType: "json",
                            data: JSON.stringify(data),
                            success: function(response) {
                                alert("LicenseService: "+response["licenseId"]);
                            },
                            error: function(response) {
                                console.log(response);
                                alert("LicenseService: " + response);
                            }
                        });
                    },
                    error: function(response) {
                        console.log(response);
                        alert("OrganizeService:" + response);
                    }
                });
            }
            else {
                alert("Ho deciso di creare solo un nuova licenza per una organizzazione già esistente!");
                $.ajax({
                    type: "POST",
                    url: "http://localhost:8080/v1/organizations/"+data['organizationId']+"/licenses/",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(data),
                    success: function(response) {
                        alert("LicenseService: "+response["licenseId"]);
                    },
                    error: function(response) {
                        console.log(response);
                        alert("LicenseService: " + response);
                    }
                });
            }
            this.reset();
            window.location.reload();
        });

    });

    function insertChildLicenseTable(callback, companyID){
        $.ajax({
            type: 'GET',
            url:'http://localhost:8080/v1/organizations/'+companyID+'/licenses/',
            dataType: 'json',
            success:function(data){
                var rows = '';
                $.each(data, function () {
                    var row = '';
                    $.each(this, function (index, item) {
                        if(item!="") {
                            row = row + '<td>' + item + '</td>';
                        }
                    });
                    rows = rows + "<tr data-toggle=\"modal\" data-id=\"1\" data-target=\"#orderModal\">" + row + "</tr>";
                });

                callback($('<table class="table table-hover table-bordered licenseTable" id="licenseTable_'+companyID+'">'+
                    '<thead><tr> <th>License ID</th> <th>Company ID</th> <th>Product Name</th> <th>License Type</th>'+
                    '<th># Licenses Purchased</th> <th># Licenses Available</th> <th>Comment</th> </tr></thead>' +
                    '<tbody>'+ rows + '</tbody></table>')).show();

                $(function() {
                    $('#orderModal').modal({
                        keyboard: true,
                        backdrop: "static",
                        show: false,

                    }).on('shown.bs.modal', function (e) {
                        var licenseID = $(e.relatedTarget).find("td:first").text();
                        var companyID = $(e.relatedTarget).find("td:nth-child(2)").text();
                        $.ajax({
                            type: 'GET',
                            url:'http://localhost:8080/v1/organizations/'+companyID+'/licenses/'+licenseID+'/rest/',
                            dataType: 'json',
                            success:function(response){
                                console.log(response);
                                $('#licenseDetails').html($('<p><ul><li><b>Product Name: </b>'+ response.productName+'</li>' +
                                                    '<li><b>Company Name: </b>'+response.organizationName+'</li>' +
                                                    '<li><b>Comment: </b>'+response.comment+'</li></ul></p>'));
                            },
                            error:function(response){
                                alert("Error");
                                console.log(response);},
                        });
                    });
                });

            },
            error:function(response){
                alert("Error");
                console.log(response);},
        });
    }

    $('select').on('change', function (e) {
        var optionSelected = $("option:selected", this);
        if (optionSelected.attr("id")=="optNewOrg"){
            $("#selectOrgDiv").slideUp("slow", function(){
                $("#DivOrgFormInfo").slideDown();
            });
        }
    });


