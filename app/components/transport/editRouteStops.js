angular
    .module('rubycampusApp')
    .controller('addRouteStopsCtrl', [
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
            var $maskedInput = $('.masked_input');
                if($maskedInput.length) {
                    $maskedInput.inputmask();
                }
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
                 $http({
                  method : "GET",
                  url : $localStorage.service+"TransportAPI/routeStops",
                  params :{id : $stateParams.id},
                  headers:{'access_token':$localStorage.access_token}
                }).then(function mySucces(data) {
                    console.log(data,'stops');
                    $scope.getRouteStopId=data.data.message[0].ID;
                   
                    if (data) {
                        $timeout(function(){
                            $scope.routeStopsData={
                                selectize_routeName:data.data.message[0].ROUTE_ID,
                                stopName:data.data.message[0].NAME,
                                selectize_vehicleName:data.data.message[0].VEHICLE_ID,
                                morningTime:data.data.message[0].PICKUPTIME,
                                eveningTime:data.data.message[0].DROPTIME,
                                fare:data.data.message[0].FARE,
                                selectize_fareType:data.data.message[0].FARETYPE
                            };
                        },500);
                    }
                },function myError(response){
                    console.log(response);
                });
                $scope.routeName=[];
                $http.get($localStorage.service+'TransportAPI/route',{headers:{'access_token':$localStorage.access_token}})
                .success(function(return_data){
                    console.log(return_data,'return_data');
                    $scope.routeName.push(return_data.message);
                });
                $scope.selectize_routeName_options = $scope.routeName;
                $scope.selectize_routeName_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Route Name',
                    valueField: 'ID',
                    labelField: 'NAME',
                    onInitialize: function(val){
                    }
                };
                $scope.vehicleName=[];
                $http.get($localStorage.service+'TransportAPI/vehicle',{headers:{'access_token':$localStorage.access_token}})
                .success(function(return_data){
                    $scope.vehicleName.push(return_data.message);
                });
                $scope.selectize_vehicleName_options = $scope.vehicleName;
                $scope.selectize_vehicleName_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Vehicle Name',
                    valueField: 'ID',
                    labelField: 'NAME',
                    onInitialize: function(val){
                    }
                };

                $scope.selectize_fareType_options = ['Annually','Quarterly','Weekly']
                $scope.selectize_fareType_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Fare Type',
                    onInitialize: function(val){
                    }
                };
                $scope.backBtn=function(){
                    window.history.back();
                }
            $scope.btnStatus="Update";
            $scope.routeStopsData={};
            $scope.saveRouteStops=function(){
                $http({
                method:'POST',
                url: $localStorage.service+'TransportAPI/routeStops',
                data: {
                    'id' : $scope.getRouteStopId,
                    'routeName' : $scope.routeStopsData.selectize_routeName,
                    'stopName' : $scope.routeStopsData.stopName,
                    'vehicleName' : $scope.routeStopsData.selectize_vehicleName,
                    'picTime' :$scope.routeStopsData.morningTime,
                    'droptime' : $scope.routeStopsData.eveningTime,
                    'fare' : $scope.routeStopsData.fare,
                    'fareType' : $scope.routeStopsData.selectize_fareType
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
                        $state.go('restricted.transport.routeStops');
                    }
                }, function error(response) {
                    // UIkit.modal.alert('Profile Name Already Vacated');
                });
                
                //$('.uk-modal').find('input').trigger('blur');
            }


        }
    ]);