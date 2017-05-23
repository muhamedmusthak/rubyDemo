angular
    .module('rubycampusApp')
    .controller('transferCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$filter,$localStorage,$http) {
            var $formValidate = $('#form_validation');
            $formValidate
                .parsley()
                .on('form:validated',function() {
                    $scope.$apply();
                })
                .on('field:validated',function(parsleyField) {
                    if($(parsleyField.$element).hasClass('md-input')) {
                        $scope.$apply();
                    }
                });
                $scope.clearValidation=function(){
                    $('#form_validation').parsley().reset();
                }
            var vm = this;
            vm.dtOptions = DTOptionsBuilder
                .newOptions()
                .withDOM("<'dt-uikit-header'<'uk-grid'<'uk-width-medium-2-3'l><'uk-width-medium-1-3'f>>>" +
                    "<'uk-overflow-container'tr>" +
                    "<'dt-uikit-footer'<'uk-grid'<'uk-width-medium-3-10'i><'uk-width-medium-7-10'p>>>")
                .withOption('createdRow', function(row, data, dataIndex) {
                    // Recompiling so we can bind Angular directive to the DT
                    $compile(angular.element(row).contents())($scope);
                })
                .withOption('headerCallback', function(header) {
                    if (!vm.headerCompiled) {
                        // Use this headerCompiled field to only compile header once
                        vm.headerCompiled = true;
                        $compile(angular.element(header).contents())($scope);
                    }
                })
                .withPaginationType('full_numbers')
                // Active Buttons extension
                .withColumnFilter({
                    aoColumns: [
                        null,
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        }
                    ]
                })
                .withButtons([
                    {
                        extend:    'print',
                        text:      '<i class="uk-icon-print"></i> Print',
                        titleAttr: 'Print'
                    },
                    {
                        extend:    'excelHtml5',
                        text:      '<i class="uk-icon-file-excel-o"></i> XLSX',
                        titleAttr: ''
                    },
                    {
                        extend:    'pdfHtml5',
                        text:      '<i class="uk-icon-file-pdf-o"></i> PDF',
                        titleAttr: 'PDF'
                    }
                ])
                 .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });

                var modal = UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false});

                $scope.selectize_usertype_options = ['Student','Employee'];
                $scope.selectize_usertype_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Resident'
                };

                $scope.refreshTable=function(){
                    $http.get($localStorage.service+'HostelAPI/TranferView',{headers:{'access_token':$localStorage.access_token}})
                    .success(function(view_data){
                        //console.log(view_data.message,'view_data11');
                        $scope.viewData=view_data.message;
                    });
                }
                $scope.refreshTable();

                $scope.empName =[];
                $http.get($localStorage.service+'HostelAPI/allocateEmployeeDetail',{headers:{'access_token':$localStorage.access_token}})
                .success(function(user_data){
                    //console.log(user_data,'user_data');
                    $scope.empName.push(user_data.result[0]);
                });
                $scope.selectize_employee_options =$scope.empName;
                $scope.selectize_employee_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Employee',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            console.log(value,"value");
                             $scope.getAllDetails(value);
                        });
                    }
                };
                $scope.studentName =[];
                $http.get($localStorage.service+'HostelAPI/allocateStudentDetail',{headers:{'access_token':$localStorage.access_token}})
                .success(function(user_data){
                    $scope.studentName.push(user_data.result);
                });
                $scope.selectize_student_options =$scope.studentName;
                $scope.selectize_student_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Student',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            //console.log(value,"value");
                        $scope.getAllDetails(value);
                        });
                    }
                };
                $scope.getAllDetails = function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'HostelAPI/TranferData',
                    params: {
                        'profileId' : id
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        console.log(return_data,'hstlll');
                        // $scope.getHostelList(return_data.data.message[0].HOSTEL_ID);
                        $scope.getBlocklList(return_data.data.message[0].BLOCK_ID);
                        $scope.getRoomList(return_data.data.message[0].ROOM_ID);
                        $timeout(function() {
                            $scope.selectize_hname=return_data.data.message[0].HOSTEL_ID;
                            $scope.selectize_block=return_data.data.message[0].BLOCK_ID;
                            $scope.selectize_room=return_data.data.message[0].ROOM_ID;
                        }, 500);
                    });
                }
                $scope.selectize_hname_options =[];
                $scope.selectize_hname_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Hostel',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            //$scope.getNameList(value);
                        });
                    }
                };
                $scope.getHostelList=function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'HostelAPI/hostelBlocks',
                    params :{id:id},
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        //console.log(return_data,'blocksss');
                        $scope.selectize_block_options=return_data.data.message;
                    });
                }
                $scope.selectize_block_options =[];
                $scope.selectize_block_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Blocks',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            
                        });
                    }
                };
                $scope.getBlocklList=function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'HostelAPI/hostelView',
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        console.log(return_data,'hostelnameee');
                        $scope.selectize_hname_options=return_data.data.message;
                        $scope.getHostelList(return_data.data.message[0].ID);
                    });
                }
                $scope.selectize_room_options =[];
                $scope.selectize_room_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Rooms',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            
                        });
                    }
                };
                $scope.getRoomList=function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'institutionApi/roomDetails',
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        $scope.selectize_room_options=return_data.data.data;
                    });
                }
                $http.get($localStorage.service+'HostelAPI/allocationView',{headers:{'access_token':$localStorage.access_token}})
                .success(function(getId){
                    $scope.getId=getId.message[0].ID;
                    //console.log($scope.getId,'getId');
                });
                $scope.saveTransfer=function(){
                    if($scope.selectize_usertype=='Student'){
                        $scope.selectize_profileId=$scope.selectize_stu_profileId
                    }else{
                        $scope.selectize_profileId=$scope.selectize_emp_profileId
                    }
                    $http({
                    method:'POST',
                    url: $localStorage.service+'HostelAPI/allocation',
                    data: {
                        'id' : $scope.getId,
                        'type' : $scope.selectize_usertype,
                        'profileId' : $scope.selectize_profileId,
                        'buildingId' : $scope.selectize_hname,
                        'blockId' : $scope.selectize_block,
                        'roomId' : $scope.selectize_room,
                        'date' : $scope.currDate
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        if(return_data.data.status==true){

                            UIkit.modal("#modal_overflow").hide();
                            UIkit.notify({
                                message : return_data.data.message,
                                status  : 'success',
                                timeout : 2000,
                                pos     : 'top-center'
                            });
                            $scope.refreshTable();
                        }else {
                            // UIkit.modal.alert('Course & Batch Name Already Exists');
                        }
                    });
                }
                var date = new Date();
                $scope.currDate=$filter('date')(date,'dd.MM.yyyy');
               //date range
                // var $dp_start = $scope.transferDate;
                // console.log($dp_start,'checkkk');
                //    $dp_end = $('#uk_dp_end');

                // var start_date = UIkit.datepicker($dp_start, {
                //     format:'DD.MM.YYYY'
                // });

                // var end_date = UIkit.datepicker($dp_end, {
                //     format:'DD.MM.YYYY'
                // });

                // $dp_start.on('change',function() {
                //     end_date.options.minDate = $dp_start.val();
                // });

                // $dp_end.on('change',function() {
                //     start_date.options.maxDate = $dp_end.val();
                // });


                $timeout(function(){
                    // date range
                    var $dp_start = $('#uk_dp_start'),
                        $dp_end = $('#uk_dp_end');

                    var start_date = UIkit.datepicker($dp_start, {
                        format:'DD.MM.YYYY'
                    });

                    var end_date = UIkit.datepicker($dp_end, {
                        format:'DD.MM.YYYY'
                    });

                    $dp_start.on('change',function() {
                        var customeDate=$dp_start.val().split(".");
                        end_date.options.maxDate = parseInt(customeDate[0])-1+"."+customeDate[1]+"."+customeDate[2];
                    });

                    $dp_end.on('change',function() {
                        start_date.options.minDate = $dp_end.val();
                    });
                },1100);

                $scope.openModel = function() {
                    $scope.btnStatus="Save";
                    $scope.hidden_id=null;
                    $scope.selectize_usertype=null;
                    $scope.selectize_hname=null;
                    $scope.selectize_emp_profileId=null;
                    $scope.selectize_stu_profileId=null;
                    $scope.selectize_block=null;
                    $scope.selectize_room=null;
                    $scope.transferDate=null;
                    $('.uk-modal').find('input').trigger('blur');
                };
                $scope.userChange=function(){
                    $scope.selectize_emp_profileId=null;
                    $scope.selectize_stu_profileId=null;
                }
                $scope.hosteChange=function(){
                    $scope.selectize_block=null;
                    $scope.selectize_room=null;
                }
                $scope.edit_data=function(data){
                   console.log(data,'edit_data');
                    $scope.btnStatus="Update";
                     // $('.uk-modal').find('Button').trigger('change');
                    if (data) {
                       
                        $timeout(function(){
                            $scope.id=data.ID;
                            $scope.selectize_usertype=data.RESIDENT_TYPE;
                            $scope.selectize_emp_profileId=data.PROFILE_ID;
                            $scope.selectize_stu_profileId=data.PROFILE_ID;
                            $scope.selectize_hname=data.HostelName;
                            $scope.selectize_room=data.roomName;
                            $scope.currDate=data.DATE;
                        },500);
                        
                         
                      
                       
                    }
                }
                $scope.deleteAllocation=function(id,$index){
                    if(id){
                        UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                            if(id){
                                $http({
                                method : "DELETE",
                                url : $localStorage.service+"HostelAPI/TranferView",
                                params : {id : id},
                                headers:{'access_token':$localStorage.access_token}
                                }).then(function mySucces(response) {
                                    UIkit.notify({
                                        message : response.data.message,
                                        status  : 'success',
                                        timeout : 2000,
                                        pos     : 'top-center'
                                    });
                                    $scope.viewData.splice($index, 1);
                                    $scope.refreshTable();
                                },function myError(response) {
                                })
                            }
                        },function(){
                            // console.log("false");
                        }, {
                            labels: {
                                'Ok': 'Ok'
                            }
                        });
                    }
                }
               
        }
    );