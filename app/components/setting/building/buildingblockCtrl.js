angular
    .module('altairApp')
    .controller('buildingblockCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$rootScope, $filter,$localStorage) {
            var vm = this;
            vm.dt_data = [];
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
                            type: 'number',
                            bRegex: true,
                            bSmart: true
                        }
                    ]
                })
                .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });
                
            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withTitle('Id'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Name'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Number'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Building')
            ];

            $scope.addBlock=function(){
                $scope.titleCaption="Add";
                $scope.btnStatus="Save";
                $scope.block_id='';
                $scope.block_name='';
                $scope.block_no='';
                $scope.selectize_buildingId='';
                $('.uk-modal').find('input').trigger('blur');
            }
            $scope.editBlock=function(result){
                // console.log(result,'result');
                $scope.titleCaption="Edit";
                $scope.btnStatus="Update";
                if(result){
                    $scope.block_id=result.ID;
                    $scope.block_name=result.NAME;
                    $scope.block_no=result.NUMBER;
                    $scope.selectize_buildingId=result.BUILDING_ID;
                }
            }
            $scope.viewData=[];
            $http.get($localStorage.service+'institutionApi/block',headers:{'access_token':$localStorage.access_token})
            .success(function(response){
                console.log(response.data,"response.data");
                $scope.viewData=response.data;
            });

            // Get building data
            $scope.buildingList=[];
            $http.get($localStorage.service+'institutionApi/building',headers:{'access_token':$localStorage.access_token})
            .success(function(building_data){
                $scope.buildingList.push(building_data.data);
            });
            $scope.selectize_buildingId_options =$scope.buildingList;
            $scope.selectize_buildingId_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Building',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };

            // Save Data
            $scope.saveBlockData=function(){
                $http({
                method:'POST',
                url: $localStorage.service+'institutionApi/block',
                data: {
                    'block_id' : $scope.block_id,
                    'block_name' : $scope.block_name,
                    'block_no' : $scope.block_no,
                    'building_id' : $scope.selectize_buildingId
                },
                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    // console.log(return_data.data.message);
                    var data=$filter('filter')($scope.buildingList,{ID:$scope.selectize_buildingId},true);
                    if($scope.block_id){
                        var data1=$filter('filter')($scope.viewData,{ID:$scope.block_id},true);
                        data1[0].NAME=$scope.block_name;
                        data1[0].NUMBER=$scope.block_no;
                        data1[0].BUILDING_ID=$scope.selectize_buildingId;
                        data1[0].BUILDING_NAME=data[0].NAME;
                    }else{
                        $scope.viewData.push({ID:return_data.data.BLOCK_ID,NAME:$scope.block_name,NUMBER:$scope.block_no,BUILDING_NAME:data[0].NAME,BUILDING_ID:$scope.selectize_buildingId});
                    }
                });
            }

            // delete block
            $scope.deleteBlock=function(id, $index){
                if(id){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(id){
                            $http({
                            method : "DELETE",
                            url : $localStorage.service+"institutionApi/block",
                            params : {id : id},
                            headers:{'access_token':$localStorage.access_token}
                            }).then(function mySucces(response) {
                                var data=response.data.message.message;
                                $scope.viewData.splice($index, 1);
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