$( document ).ready(function() {

    $('.loader').fadeOut(1500);

    //BIG BUTTONS FUNCTIONALITY

    $(".personnelButton").click(function (){
        if ($(".personnel").hasClass("d-none")) {
            $(".personnel").removeClass("d-none");
            $("#department").addClass("d-md-none");
            $("#location").addClass("d-md-none");
            $("#barSpan").html(" - Personnel");
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
            $(".personnelButton").trigger('click');
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
            $(".personnelButton").trigger('click');
        }
    });

    //P.DATA

    function personnelDataOutput(data) {
        data.forEach(employee => {
            let personnelRow =
            `<tr class="personnelRowClick" href=${employee.id}>
                <td class="fw-bold p-2">${employee.lastName}</td>
                <td class="fw-bold p-2">${employee.firstName}</td>
            </tr>`;
            $('#personnelTableBody').append(personnelRow);
        });
        $('#deletePersonnelButton').val(data[0].id)
        $('.fullName').html(data[0].firstName + ' ' + data[0].lastName);
        $('.depart').html(data[0].department);
        $('.loc').html(data[0].location);
        if(data[0].jobTitle != ''){
            $('.jTitleP, .jobT').removeClass('d-none');
            $('.jobT').html(data[0].jobTitle);
        } else {
            $('.jTitleP, .jobT').addClass('d-none');
        }
        if(data[0].email != ''){
            $('.mailP, .mail').removeClass('d-none');
            $('.mail').html(data[0].email);
        } else {
            $('.mailP, .mail').addClass('d-none');
        }
        $('#updatePersonnelButton').val(data[0].id)
        $('#updatePersonnelFirstName').val(data[0].firstName);
        $('#updatePersonnelLastName').val(data[0].lastName);
        $('#updatePersonnelJobTitle').val(data[0].jobTitle);
        $('#updatePersonnelEmail').val(data[0].email);
        $('#updatePersonnelDepartment').val(data[0].departmentID).change();
    };

    //GET ALL PERSONNEL

function personnelGetAll(url) {
    $('#personnelTableBody').empty();
    $('#pagination').empty();
    $('#pageButtons').removeClass("d-none");
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
            if (result.status.name == "ok") {
                personnelDataOutput(result.data);
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

    //GET ALL DEPARTMENTS

    function departmentGetAll() {
    $('.departmentTableBody').empty();
    $('.dapartmentsSort').empty();
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
                                <button type="button" class="btn btn-outline-primary btn-sm mx-1 updateDepBtn" value=${department.id}><i class="fas fa-pen-to-square"></i></button>
                                <button type="button" class="btn btn-outline-danger btn-sm deleteDepBtn" value=${department.id}><i class="fas fa-trash"></i></button>
                            </td>
                            </tr>`;
                        let sortDepartments = `<button type="button" class="list-group-item list-group-item-action departmentSelect" value="${department.id}">${department.name}</button>`
                            $('.departmentTableBody').append(departmentRow);
                            $('.dapartmentsSort').append(sortDepartments);

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

    //GET ALL LOCATIONS

function locationGetAll() {
    $('.locationTableBody').empty();
    $('.locationsSort').empty();
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
                            <button type="button" class="btn btn-outline-primary btn-sm mx-1 updateLocationBtn" value=${location.id}><i class="fas fa-pen-to-square"></i></button>
                            <button type="button" class="btn btn-outline-danger btn-sm  deleteLocationBtn" value=${location.id}><i class="fas fa-trash"></i></button>
                            </td>
                            </tr>`;

                        let sortLocations = `<button type="button" class="list-group-item list-group-item-action locationSelect" value="${location.id}">${location.name}</button>`;

                    $('#addDepartmentLocation, #updateDepartmentLocation').append(`<option value="${location.id}">${location.name}</option>`);
                    $('.locationTableBody').append(locationRow);
                    $('.locationsSort').append(sortLocations);

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
        $('#addEmplDepartment, #updatePersonnelDepartment, #addDepartmentLocation, #updateDepartmentLocation').empty();
        $('#addEmplFirstName, #addEmplLastName, #addEmplJobTitle, #addEmplEmail, #addDepartment, #addLocation').val('');
        locationGetAll();
        departmentGetAll();
        let getAllUrl = "php/getAll.php";
        personnelGetAll(getAllUrl);
        $('#pHeader').text('Personnel');
    }

    callAll();

    //SEARCH

    $('#personnelInputSearch').keyup( function () {
    let txt = $(this).val();
    if (txt != "") {
        $('#personnelTableBody').empty();
        $('#pagination').empty();
        $('#pageButtons').addClass("d-none");
        $('#pHeader').text('Personnel');
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
                    personnelDataOutput(result['data']);

                
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
            let getAllUrl = "php/getAll.php";
            personnelGetAll(getAllUrl);
        }
   })

//SORT

    $('#sortFirstName').click(function () {
        let url = "php/getAllByFirstName.php";
        personnelGetAll(url);
        $('#pHeader').text('Personnel');
    })

    $('#sortLastName').click(function () {
        let url = "php/getAllByLastName.php";
        personnelGetAll(url);
        $('#pHeader').text('Personnel');
    })

    $(document).on('click', '.departmentSelect', function() {
        $('#personnelTableBody').empty();
        $('#pagination').empty();
        $('#pageButtons').addClass("d-none");
        $('#allByDepartmentModal').modal('hide');
        $.ajax({
            url: "php/getAllByDepartment.php",
            type: 'POST',
            dataType: 'json',
            data: {
                departmentID:  $(this).val(),
            },
            success: function(result) {
                if (result.status.name == "ok") {
                    if (result['data'].length > 0){
                        personnelDataOutput(result['data']);
                    $('#pHeader').text(result.data[0].department);
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
        $(document).on('click', '.locationSelect', function() {
            $('#personnelTableBody').empty();
            $('#pagination').empty();
            $('#pageButtons').addClass("d-none");
            $('#allByLocationModal').modal('hide');
            $.ajax({
                url: "php/getAllByLocation.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    locationID:  $(this).val(),
                },
                success: function(result) {
                    if (result.status.name == "ok") {
                        if (result['data'].length > 0){
                            personnelDataOutput(result['data'])
                        $('#pHeader').text(result.data[0].location);
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
            
    // PERSONNEL \\

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
                    $('.jTitleP, .jobT').removeClass('d-none');
                    $('.jobT').html(result.data[0].jobTitle);
                } else {
                    $('.jTitleP, .jobT').addClass('d-none');
                }
                if(result.data[0].email != ''){
                    $('.mailP, .mail').removeClass('d-none');
                    $('.mail').html(result.data[0].email);
                } else {
                    $('.mailP, .mail').addClass('d-none');
                }
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
            $('#createEmployeeModal').modal('hide');
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
                            $('#createEmployeeModal').modal('hide');
                            $("#lastModal").modal('show');
                            $('#confirmationMSG').html(result.data[0]);
                            callAll();
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
    })

    $('#updatePersonnelButton').click(function () {
        let firstNameVal = $('#updatePersonnelFirstName').val();
        let lastNameVal = $('#updatePersonnelLastName').val();
        let jobTitleVal = $('#updatePersonnelJobTitle').val();
        let emailVal = $('#updatePersonnelEmail').val();
        let departmentId = $('#updatePersonnelDepartment').val();
        let id = $('#updatePersonnelButton').val()
        if(firstNameVal === '' || lastNameVal === '') {
            $('#updateEmployeeModal').modal('hide');
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
                            $('#updateEmployeeModal').modal('hide');
                            $("#lastModal").modal('show');
                            $('#confirmationMSG').html(result.data[0]);
                            callAll();
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

        //DEPARTMENTS\\

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

    $('#addDepartmentButton').click(function () {
        let departmentName = $('#addDepartment').val();
        let location = $('#addDepartmentLocation').val();
        if(departmentName === '') {
            $("#createDepartmentModal").modal('hide');
            $("#lastModal").modal('show');
            $('#confirmationMSG').html('Please provide name and location of a new department.');
        } else {
                $.ajax({
                    url: "php/insertDepartment.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                       name: departmentName,
                       locationID: location,
                    },
                    success: function(result) {
                        if (result.status.name == "ok") {
                            $("#createDepartmentModal").modal('hide');
                            $("#lastModal").modal('show');
                            $('#confirmationMSG').html(result.data[0]);
                            callAll();
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
    })

    $(document).on('click', '.deleteDepBtn', function() {
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
        });
    

    $(document).on('click', '.updateDepBtn', function() {
        $('#updateDepartmentButton').val($(this).val());
        $('#updateDepartmentModal').modal('show');
        });
    
    $('#updateDepartmentButton').click(function () {
        let departmentName = $('#updateDepartment').val();
        let location = $('#updateDepartmentLocation').val();
        let id = $('#updateDepartmentButton').val();
        if(departmentName === '') {
            $("#updateDepartmentModal").modal('hide');
            $("#lastModal").modal('show');
            $('#confirmationMSG').html('Please provide name of a modified department.');
        } else {
                $.ajax({
                    url: "php/updateDepartment.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                       departmentName: departmentName,
                       location: location,
                       id: id
                    },
                    success: function(result) {
                        if (result.status.name == "ok") {
                            $("#updateDepartmentModal").modal('hide');
                            $("#lastModal").modal('show');
                            $('#confirmationMSG').html(result.data[0]);
                            callAll();
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
    })

    //LOCATIONS\\

    $('#addLocationButton').click(function () {
        let locationName = $('#addLocation').val();
        if(locationName === '') {
            $("#createLocationModal").modal('hide');
            $("#lastModal").modal('show');
            $('#confirmationMSG').html('Please provide name of a new location.');
        } else {
                $.ajax({
                    url: "php/insertLocation.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                       name: locationName,
                    },
                    success: function(result) {
                        if (result.status.name == "ok") {
                            $("#createLocationModal").modal('hide');
                            $("#lastModal").modal('show');
                            $('#confirmationMSG').html(result.data[0]);
                            callAll();
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
    })

    $(document).on('click', '.deleteLocationBtn', function() {
        $.ajax({
            url: "php/deleteLocationByID.php",
            type: 'POST',
            dataType: 'json',
            data: {
                id:  $(this).val(),
            },
            success: function(result) {
                console.log(result)
                if (result.status.name == "ok") {
                    callAll();
                    $('#confirmationMSG').html(result.data[0]);
                    $("#lastModal").modal('show');
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


    $(document).on('click', '.updateLocationBtn', function() {
        $.ajax({
            url: "php/getLocationsByID.php",
            type: 'POST',
            dataType: 'json',
            data: {
                locationID:  $(this).val(),
            },
            success: function(result) {
                if (result.status.name == "ok") {
                    $('#updateLocation').val(result.data[0].name);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
                console.log(errorThrown);
                console.log(textStatus);
                console.log(jqXHR);      
            }
            });
        $('#updateLocationButton').val($(this).val());
        $('#updateLocationModal').modal('show');
        });
    
    $('#updateLocationButton').click(function () {
        let locationName = $('#updateLocation').val();
        let id = $('#updateLocationButton').val();
        if(locationName === '') {
            $("#updateLocationModal").modal('hide');
            $("#lastModal").modal('show');
            $('#confirmationMSG').html('Please provide name of a modified location.');
        } else {
                $.ajax({
                    url: "php/updateLocation.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                       locationName: locationName,
                       id: id
                    },
                    success: function(result) {
                        if (result.status.name == "ok") {
                            $("#updateLocationModal").modal('hide');
                            $("#lastModal").modal('show');
                            $('#confirmationMSG').html(result.data[0]);
                            callAll();
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
    })

    //REFRESH BUTTON

    $('.refreshBtn').click(function () {
        callAll();
    })

});