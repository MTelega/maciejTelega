$( document ).ready(function() {

    //BIG BUTTONS FUNCTIONALITY

    $(".personnelButton").click(function (){
        if ($(".personnel").hasClass("d-none")) {
            $(".personnel").removeClass("d-none");
            $("#department").addClass("d-md-none");
            $("#location").addClass("d-md-none");
            $("#barSpan").html(" - Personnel");
        } else {
            $(".personnel").addClass("d-none");
            $("#barSpan").html("");
        }
    });

    $(".departmentButton").click(function (){
        if ($("#department").hasClass("d-md-none")) {
            $("#department").removeClass("d-md-none");
            $("#location").addClass("d-md-none");
            $(".personnel").addClass("d-none");
            $("#barSpan").html(" - Department");
        } else {
            $("#department").addClass("d-md-none");
            $("#barSpan").html("");
        }
    })

    $(".locationButton").click(function (){
        if ($("#location").hasClass("d-md-none")) {
            $("#location").removeClass("d-md-none");
            $("#department").addClass("d-md-none");
            $(".personnel").addClass("d-none");
            $("#barSpan").html(" - Location");
        } else {
            $("#location").addClass("d-md-none");
            $("#barSpan").html("");
        }
    });

    //P.DATA OUTPUT

    function personnelDataOutput(data, array) {
        data.forEach(employee => {
            let firstLetterFName = employee.firstName.charAt(0);
            let firstLetterLName = employee.lastName.charAt(0);

            let personnelRow =
            `<tr class="personnelRowClick" href=${employee.id}>
                <td class="fw-bold p-2"><div class="circleDiv d-inline border border-2 p-1">${firstLetterFName}${firstLetterLName}</div> ${employee.firstName} ${employee.lastName}</td>
            </tr>`;
            array.push(personnelRow);
        });
        $('#deletePersonnelButton').val(data[0].id)
        $('.fullName').html(data[0].firstName + ' ' + data[0].lastName);
        $('.depart').html(data[0].department);
        $('.loc').html(data[0].location);
        if(data[0].jobTitle != ''){
            $('.jTitleP').removeClass('d-none');
            $('.jobT').html(data[0].jobTitle);
        } else {
            $('.jTitleP').addClass('d-none');
        }
        $('.mail').html(data[0].email);
        $('#updatePersonnelButton').val(data[0].id)
        $('#updatePersonnelFirstName').val(data[0].firstName);
        $('#updatePersonnelLastName').val(data[0].lastName);
        $('#updatePersonnelJobTitle').val(data[0].jobTitle);
        $('#updatePersonnelEmail').val(data[0].email);
        $('#updatePersonnelDepartment').val(data[0].departmentID).change();

    };


    //PAGINATION

    function accomodatePage(clickedPage, numberOfPages) {
        if (clickedPage <= 1) { return clickedPage + 1}
        if (clickedPage >= numberOfPages) { return clickedPage -1}
        return clickedPage
    }

    function buildPagination(clickedPage, numberOfPages) {
        $('.pagination').empty();
        const currPageNum = accomodatePage(clickedPage, numberOfPages);
        if (numberOfPages >= 3) {
            for (let i=-1; i<2; i++) {
                $('.pagination').append(`<li class="page-item"><button class="btn btn-primary border mb-1" value="${currPageNum+i}">${currPageNum+i}</button></li>`)
            }
        } else {
            for (let i=0; i<numberOfPages; i++) {
                $('.pagination').append(`<li class="page-item"><button class="btn btn-primary border mb-1" value="${i+1}">${i+1}</button></li>`)
            }
        }
    }

    function buildPage(currPage, numberPerPage, personnelArray) {
        const trimStart = (currPage-1)*numberPerPage;
        const trimEnd = trimStart + numberPerPage;
        $('#personnelTableBody').empty().append(personnelArray.slice(trimStart, trimEnd));
    }

    //GET ALL PERSONNEL

function personnelGetAll(url) {
    $('#personnelTableBody').empty();
    $('#pagination').empty();
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
            if (result.status.name == "ok") {
                const personnelArray = [];
    
                personnelDataOutput(result.data, personnelArray);
                
            const numberOfItems = personnelArray.length;
            const numberPerPage = 20;
            const currentPage = 1;
            const numberOfPages = Math.ceil(numberOfItems/numberPerPage);
    
            buildPage(1, numberPerPage, personnelArray);
            buildPagination(currentPage, numberOfPages);
    
            $('.pagination').on('click', 'button', function() {
                let clickedPage = parseInt($(this).val());
                buildPagination(clickedPage, numberOfPages);
                buildPage(clickedPage, numberPerPage, personnelArray);
            });
                
                }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);      
        }
        });
    }

    function departmentGetAll() {
    $('.departmentTableBody').empty();
    $.ajax({
        url: "php/getAllDepartments.php",
        type: 'GET',
        dataType: 'json',
        success: function(result) {
            if (result.status.name == "ok") {
                if (result['data'].length > 0){
                    result.data.forEach(department => {
                        $('#addEmplDepartment, #updatePersonnelDepartment').append(`<option value="${department.id}">${department.name} - ${department.location}</option>`);
                        let departmentRow = `<tr>
                            <td class="fw-bold">${department.name}</td>
                            <td class="d-none d-md-table-cell">${department.location}</td><td>
                                <button type="button" class="btn btn-primary btn-sm mx-1 updateDepBtn" value=${department.id}><i class="fas fa-pen-to-square"></i></button>
                                <button type="button" class="btn btn-danger btn-sm deleteDepBtn" value=${department.id}><i class="fas fa-trash"></i></button>
                            </td>
                            </tr>`;
                            $('.departmentTableBody').append(departmentRow);

                    })
                }
                }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);      
        }
        });
    }

function locationGetAll() {
    $('#locationTableBody').empty();
    $.ajax({
        url: "php/getAllLocations.php",
        type: 'GET',
        dataType: 'json',
        success: function(result) {
            if (result.status.name == "ok") {
                if (result['data'].length > 0) {
                    result.data.forEach(location => {
                        let locationRow = `<tr>
                            <td>${location.name}</td>
                            <td>
                            <button type="button" class="btn btn-success btn-sm mx-1"><i class="fas fa-pen-to-square"></i></button>
                            <button type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
                            </td>
                            </tr>`;
                    $('#addDepartmentLocation, #updateDepartmentLocation').append(`<option value="${location.id}">${location.name}</option>`);
                    $('#locationTableBody').append(locationRow);
                    })
                }  
                }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);      
        }
        });
    }

    //CALLING ALL DATA
    function callAll () {
        locationGetAll();
        departmentGetAll();
        let getAllUrl = "php/getAll.php";
        personnelGetAll(getAllUrl);
    }

    callAll();





    //SEARCH

    $('#personnelInputSearch').keyup( function () {
    let txt = $(this).val();
    if (txt != "") {
        $('#personnelTableBody').empty();
        $('#pagination').empty();
        $('#pageButtons').addClass("d-none");
        
        $.ajax({
        url: "php/getAllSearch.php",
        type: 'GET',
        dataType: 'json',
        data: {
            search: txt
        },
        success: function(result) {
            if (result.status.name == "ok") {
                if (result['data'].length > 0){
                    result['data'].forEach(employee => {
                        let firstLetterFName = employee.firstName.charAt(0);
                        let firstLetterLName = employee.lastName.charAt(0);
                        let personnelRow =
                        `<tr class="personnelRowClick" href=${employee.id}>
                        <td class="fw-bold p-2"><div class="circleDiv d-inline border border-2 p-1">${firstLetterFName}${firstLetterLName}</div> ${employee.firstName} ${employee.lastName}</td>
                        </tr>`;
                        
                        $('#personnelTableBody').append(personnelRow);
                });
                $('#deletePersonnelButton').val(result.data[0].id)
                $('.fullName').html(result.data[0].firstName + ' ' + result.data[0].lastName);
                $('.depart').html(result.data[0].department);
                $('.loc').html(result.data[0].location);
                if(result.data[0].jobTitle != ''){
                    $('.jTitleP').removeClass('d-none');
                    $('.jobT').html(result.data[0].jobTitle);
                } else {
                    $('.jTitleP').addClass('d-none');
                }
                $('.mail').html(result.data[0].email);
                $('#updatePersonnelButton').val(result.data[0].id)
                $('#updatePersonnelFirstName').val(result.data[0].firstName);
                $('#updatePersonnelLastName').val(result.data[0].lastName);
                $('#updatePersonnelJobTitle').val(result.data[0].jobTitle);
                $('#updatePersonnelEmail').val(result.data[0].email);
                $('#updatePersonnelDepartment').val(result.data[0].departmentID).change();
            }
            }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);      
    }
    });
        } else if (txt == '' || txt.trim() == ''){
            $('#pageButtons').removeClass("d-none");
            let getAllUrl = "php/getAll.php";
            personnelGetAll(getAllUrl);
        }
   })

//SORT

    $('#sortFirstName').click(function () {
        let url = "php/getAllByFirstName.php";
        personnelGetAll(url);
    })

    $('#sortLastName').click(function () {
        let url = "php/getAllByLastName.php";
        personnelGetAll(url);
    })

    $('#sortDepartment').click(function () {
        let url = "php/getAllByDepartment.php";
        personnelGetAll(url);
        $('.dep-row').removeClass('d-none');
        $('.loc-row').addClass('d-none');
    })

    $('#sortLocation').click(function () {
        let url = "php/getAllByLocation.php";
        personnelGetAll(url);
        $('.dep-row').addClass('d-none');
        $('.loc-row').removeClass('d-none');
    })
  

  $('#addLocationB').click(function () {
       $('#confirmationMSG').html("Are you shure you wish to create a new location?");
       $('#subButton').attr('form', 'addLocationForm');
  })

$('#subButton').click(function () {
    if($('#subButton').attr('form') == 'addLocationForm') {
        $('#addLocationForm').submit(function(e) {
            e.preventDefault();
            $.ajax({
                url: "php/insertLocation.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    name: $(this).find('input[name="addLocation"]').val(),
                },
                success: function(result) {
                    if (result.status.name == "ok") {
                     
                          
                        
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    // your error code
                    console.log(errorThrown);
                    console.log(textStatus);
                    console.log(jqXHR);      
                }
              });
        })
        $('#confirmationMSG').modal('hide');
    }
    
    })
   /*

    $.ajax({
        url: "php/insertLocation.php",
        type: 'POST',
        dataType: 'json',
        data: {
            name: 'Cardiff',
        },
        success: function(result) {
            console.log(result)
            if (result.status.name == "ok") {
             
                  
                
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);      
        }
      });

$.ajax({
    url: "php/insertDepartment.php",
    type: 'POST',
    dataType: 'json',
    data: {
        name: 'hgdjhfh',
        locationID: 2
    },
    success: function(result) {
        console.log(result)
        if (result.status.name == "ok") {
         
              
            
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);      
    }
  });
*/


    $.ajax({
    url: "php/deleteLocationByID.php",
    type: 'POST',
    dataType: 'json',
    data: {
        id: 36,
    },
    success: function(result) {
        if (result.status.name == "ok") {
            
                
            
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);      
    }
    });
            

    $(document).on('click', '.personnelRowClick', function() {
    $.ajax({
        url: "php/getPersonnelByID.php",
        type: 'POST',
        dataType: 'json',
        data: {
            id:  $(this).attr('href'),
        },
        success: function(result) {
            if (result.status.name == "ok") {
                $('#deletePersonnelButton').val(result.data[0].id)
                $('.fullName').html(result.data[0].firstName + ' ' + result.data[0].lastName);
                $('.depart').html(result.data[0].department);
                $('.loc').html(result.data[0].location);
                if(result.data[0].jobTitle != ''){
                    $('.jTitleP').removeClass('d-none');
                    $('.jobT').html(result.data[0].jobTitle);
                } else {
                    $('.jTitleP').addClass('d-none');
                }
                $('.mail').html(result.data[0].email);
                $('#updatePersonnelButton').val(result.data[0].id)
                $('#updatePersonnelFirstName').val(result.data[0].firstName);
                $('#updatePersonnelLastName').val(result.data[0].lastName);
                $('#updatePersonnelJobTitle').val(result.data[0].jobTitle);
                $('#updatePersonnelEmail').val(result.data[0].email);
                $('#updatePersonnelDepartment').val(result.data[0].departmentID).change();

                if (window.innerWidth < 768) {
                    $('#personnelInfoModal').modal('show');
                  }
                
            
                
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);      
        }
        });
    });

    $('#addPersonnelButton').click(function () {
        let firstNameVal = $('#addEmplFirstName').val();
        let lastNameVal = $('#addEmplLastName').val();
        let jobTitleVal = $('#addEmplJobTitle').val();
        let emailVal = $('#addEmplEmail').val();
        let departmentId = $('#addEmplDepartment').val();
        if(firstNameVal === '' || lastNameVal === '') {
            $("#confirmAddPersonnelModal").modal('hide');
            $("#lastModal").modal('show');
            $('#confirmationMSG').html('Please provide first and last name of a new personnel.');
        } else {
                $.ajax({
                    url: "php/insertPersonnel.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                       firstName: firstNameVal,
                       lastName: lastNameVal,
                       jobTitle: jobTitleVal,
                       departmentID: departmentId,
                       email: emailVal
                    },
                    success: function(result) {
                        if (result.status.name == "ok") {
                            $("#lastModal").modal('show');
                            $('#confirmationMSG').html(result.data[0]);
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        // your error code
                        console.log(errorThrown);
                        console.log(textStatus);
                        console.log(jqXHR);      
                    }
                    });
            $("#confirmAddPersonnelModal").modal('hide');
            callAll();
        }
    })

    $('#updatePersonnelButton').click(function () {
        let firstNameVal = $('#updatePersonnelFirstName').val();
        let lastNameVal = $('#updatePersonnelLastName').val();
        let jobTitleVal = $('#updatePersonnelJobTitle').val();
        let emailVal = $('#updatePersonnelEmail').val();
        let departmentId = $('#updatePersonnelDepartment').val();
        let id = $('#updatePersonnelButton').val()
        if(firstNameVal === '' || lastNameVal === '') {
            $("#confirmUpdatePersonnelModal").modal('hide');
            $("#lastModal").modal('show');
            $('#confirmationMSG').html('Please provide first and last name of a modified personnel.');
        } else {
                $.ajax({
                    url: "php/updatePersonnel.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                       firstName: firstNameVal,
                       lastName: lastNameVal,
                       jobTitle: jobTitleVal,
                       departmentID: departmentId,
                       email: emailVal,
                       id: id
                    },
                    success: function(result) {
                        if (result.status.name == "ok") {
                            $("#lastModal").modal('show');
                            $('#confirmationMSG').html(result.data[0]);
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        // your error code
                        console.log(errorThrown);
                        console.log(textStatus);
                        console.log(jqXHR);      
                    }
                    });
            $("#confirmUpdatePersonnelModal").modal('hide');
            callAll();
        }
    })
    

    $('#deletePersonnelButton').click(function() {
        $.ajax({
            url: "php/deletePersonnelByID.php",
            type: 'POST',
            dataType: 'json',
            data: {
                id:  $(this).val(),
            },
            success: function(result) {
                if (result.status.name == "ok") {
                    callAll();
                    $('#confirmationMSG').html(result.data[0]);

                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
                console.log(errorThrown);
                console.log(textStatus);
                console.log(jqXHR);      
            }
            });
        });

$(document).on('click', '.updateDepBtn', function() {
    $.ajax({
        url: "php/getDepartmentByID.php",
        type: 'POST',
        dataType: 'json',
        data: {
            id:  $(this).val(),
        },
        success: function(result) {
            if (result.status.name == "ok") {
                $('#updateDepartment').val(result.data[0].name);
                $('#updateDepartmentLocation').val(result.data[0].locationID).change();
                $('#updateDepartmentModal').modal('show');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);      
        }
        });
    });

    $(document).on('click', '.deleteDepBtn', function() {
        $('#deleteDepartmentButton').val($(this).val());
        $('#deleteDepartmentModal').modal('show');
        });
    
    $('#deleteDepartmentButton').click(function () {
        $('#deleteDepartmentModal').modal('hide');
        $.ajax({
            url: "php/deleteDepartmentByID.php",
            type: 'POST',
            dataType: 'json',
            data: {
                id:  $(this).val(),
            },
            success: function(result) {
                if (result.status.name == "ok") {
                    callAll();
                    $('#confirmationMSG').html(result.data[0]);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
                console.log(errorThrown);
                console.log(textStatus);
                console.log(jqXHR);      
            }
            });
    })

    $('#refreshBtn').click(function () {
        callAll();
    })

});