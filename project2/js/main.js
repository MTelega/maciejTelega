$( document ).ready(function() {

    //BIG BUTTONS FUNCTIONALITY

    $("#personnelButton").click(function (){
        if ($("#personnel").hasClass("d-none")) {
            $("#personnel").removeClass("d-none");
            $("#department").addClass("d-none");
            $("#location").addClass("d-none");
            $("#barSpan").html(" - Personnel");
        } else {
            $("#personnel").addClass("d-none");
            $("#barSpan").html("");
        }
    });

    $("#departmentButton").click(function (){
        if ($("#department").hasClass("d-none")) {
            $("#department").removeClass("d-none");
            $("#location").addClass("d-none");
            $("#personnel").addClass("d-none");
            $("#barSpan").html(" - Department");
        } else {
            $("#department").addClass("d-none");
            $("#barSpan").html("");
        }
    })

    $("#locationButton").click(function (){
        if ($("#location").hasClass("d-none")) {
            $("#location").removeClass("d-none");
            $("#department").addClass("d-none");
            $("#personnel").addClass("d-none");
            $("#barSpan").html(" - Location");
        } else {
            $("#location").addClass("d-none");
            $("#barSpan").html("");
        }
    });

    //P.DATA OUTPUT

    function personnelDataOutput(data, array) {
        data.forEach(employee => {
            let personnelRow =
            `<tr>
                <td>${employee.id}</td>
                <td class="fw-bold">${employee.firstName} ${employee.lastName}</td>
                <td>${employee.department}</td>
                <td class="d-none d-md-table-cell">${employee.location}</td>
                <td class="d-none d-xl-table-cell">${employee.email}</td>
                <td>
                <button type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
           
            array.push(personnelRow);
        });
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
                $('.pagination').append(`<li class="page-item"><button class="btn btn-primary border" value="${currPageNum+i}">${currPageNum+i}</button></li>`)
            }
        } else {
            for (let i=0; i<numberOfPages; i++) {
                $('.pagination').append(`<li class="page-item"><button class="btn btn-primary border" value="${i+1}">${i+1}</button></li>`)
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
        $.ajax({
            url: "php/getAllDepartments.php",
            type: 'GET',
            dataType: 'json',
            success: function(result) {
                if (result.status.name == "ok") {
                    if (result['data'].length > 0){
                        result.data.forEach(department => {
                            $('#addEmplDepartment, #updatePersonelDepartment').append(`<option value="${department.id}">${department.name}</option>`);
                            let departmentRow = `<tr>
                                <th scope="row">${department.id}</th>
                                <td class="fw-bold">${department.name}</td>
                                <td class="d-none d-md-table-cell">${department.location}</td><td>
                                    <button type="button" class="btn btn-success btn-sm mx-1"><i class="fas fa-pen-to-square"></i></button>
                                    <button type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
                                </td>
                                </tr>`;
                                $('#departmentTableBody').append(departmentRow);
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
        $.ajax({
            url: "php/getAllLocations.php",
            type: 'GET',
            dataType: 'json',
            success: function(result) {
                if (result.status.name == "ok") {
                  if (result['data'].length > 0) {
                      result.data.forEach(location => {
                            let locationRow = `<tr>
                                <th scope="row">${location.id}</th>
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

      let getAllUrl = "php/getAll.php";
      personnelGetAll(getAllUrl);

      departmentGetAll();

      locationGetAll();



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
                            let personnelRow =
                            `<tr>
                                <td>${employee.id}</td>
                                <td class="fw-bold">${employee.firstName} ${employee.lastName}</td>
                                <td>${employee.department}</td>
                                <td class="d-none d-md-table-cell">${employee.location}</td>
                                <td class="d-none d-xl-table-cell">${employee.email}</td>
                                <td>
                                <button type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>`;
                            
                            $('#personnelTableBody').append(personnelRow);
                        });
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

    $('#sortID').click(function () {
        let url = "php/getAll.php";
        personnelGetAll(url);
    })

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
    })

    $('#sortLocation').click(function () {
        let url = "php/getAllByLocation.php";
        personnelGetAll(url);
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
        })
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
*/


});