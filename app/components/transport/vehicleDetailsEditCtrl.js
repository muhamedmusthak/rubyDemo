angular
    .module('rubycampusApp')
    .controller('vehicleDetailsEditCtrl', [
        '$scope',
        '$window',
        '$timeout',
        '$filter',
        '$http',
        '$state',
        '$rootScope',
        '$localStorage',
        '$stateParams',
        function ($scope, $window, $timeout,$filter, $http, $state, $rootScope, $localStorage,$stateParams) {

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
                $('.dropify').dropify();
                $('.dropify-fr').dropify({
                    messages: {
                        default: 'Glissez-déposez un fichier ici ou cliquez',
                        replace: 'Glissez-déposez un fichier ou cliquez pour remplacer',
                        remove:  'Supprimer',
                        error:   'Désolé, le fichier trop volumineux'
                    }
                });
                //$scope.btnStatus="Update";
                $http({
                  method : "GET",
                  url : $localStorage.service+"TransportAPI/vehicle",
                  params :{id : $stateParams.id},
                  headers:{'access_token':$localStorage.access_token}
                }).then(function mySucces(data) {
                    //console.log(data,'vehicle');
                    $scope.getVehicleId=data.data.message[0].ID;
                   
                    if (data) {
                        $timeout(function(){
                            $scope.vehicledata={
                                vehicle_name:data.data.message[0].NAME,
                                vehicle_type:data.data.message[0].TYPE,
                                capacity:data.data.message[0].CAPACITY,
                                regi_number:data.data.message[0].REG_NO,
                                selectize_resPerson:data.data.message[0].RES_PERSON,
                                item_image:data.data.message[0].IMAGE1
                            };
                        },500);
                    }
                },function myError(response){
                    console.log(response);
                });
                $scope.empList=[];
                $http.get($localStorage.service+'SettingAPI/employeeList',{headers:{'access_token':$localStorage.access_token}})
                .success(function(return_data){
                    $scope.empList.push(return_data.data);
                });
                $scope.selectize_emp_options = $scope.empList;
                $scope.selectize_emp_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Responsible Person',
                    valueField: 'PROFILE_ID',
                    labelField: 'FULLNAME',
                    searchField: 'FULLNAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            //console.log(value);
                        });
                    }
                };
                
                $scope.backBtn=function(){
                    window.history.back();
                }
            $scope.btnStatus="Update";
        
            $scope.updateVehicle=function(){
                var $fileInput = $('.dropify-preview').find('img').attr('src');
                // console.log($fileInput,'imageee');
                $http({
                method:'POST',
                url: $localStorage.service+'TransportAPI/vehicle',
                data: {
                    'id' :  $scope.getVehicleId,
                    'name' : $scope.vehicledata.vehicle_name,
                    'type' : $scope.vehicledata.vehicle_type,
                    'capacity' : $scope.vehicledata.capacity,
                    'regiNumber' :$scope.vehicledata.regi_number,
                    'resPerson' : $scope.vehicledata.selectize_resPerson,
                    'image1' : $fileInput
                },
                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){

                    console.log(return_data,'return_datareturn_data');
                    if(return_data.data.status==true){
                        UIkit.notify({
                            message : return_data.data.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $state.go('restricted.transport.vehicleDetail');
                    }
                }, function error(response) {
                    //UIkit.modal.alert('Profile Name Already Vacated');
                });
                
                //$('.uk-modal').find('input').trigger('blur');
            }


        }
    ]);