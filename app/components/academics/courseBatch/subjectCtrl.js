angular
    .module('altairApp')
    .controller('subjectCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder, $filter,$http,$rootScope,$localStorage) {
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

            $scope.courseData=[];
            $scope.viewData=[];
            $http.get($localStorage.service+'AcademicsAPI/fetchCourseData',headers:{'access_token':$localStorage.access_token})
            .success(function(course_data){
                $scope.courseData.push(course_data.data);
            });

            $http.get($localStorage.service+'AcademicsAPI/subjectDetail',headers:{'access_token':$localStorage.access_token})
            .success(function(course_data){
                $scope.viewData=course_data.message;
            });

            $scope.selectize_courseName_options =$scope.courseData;
            $scope.selectize_courseName_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Course',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };

            $scope.selectize_subType_options =['Daily','Regular'];
            $scope.selectize_subType_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Type',
            };

            $scope.addSubject = function() {
                $scope.titCaption="Add";
                $scope.btnStatus='Save';
                $scope.cou_sub_id='';
                $scope.sub_id='';
                $scope.subject_name='';
                $scope.sub_code='';
                $scope.sub_type='';
                $scope.course_id='';
                $scope.total_hours='';
                $scope.credit_hours='';
                $('.uk-modal').find('input').trigger('blur');
            };
            $scope.editSubject= function(res){
                $scope.titCaption="Edit";
                $scope.btnStatus='Update';
                console.log(res,'resssssss');
                if(res){
                    $scope.cou_sub_id=res.ID;
                    $scope.sub_id=res.SUB_ID;
                    $scope.subject_name=res.NAME;
                    $scope.sub_code=res.CODE;
                    $scope.sub_type=res.TYPE;
                    $scope.course_id=res.COURSE_ID;
                    $scope.total_hours=res.TOTAL_HOURS;
                    $scope.credit_hours=res.CREDIT_HOURS;
                }
            }

            $scope.saveSubjectData=function(){
                $http({
                    method:'POST',
                    url: $localStorage.service+'AcademicsAPI/subjectDetail',
                    data: {
                        'cou_sub_id' : $scope.cou_sub_id,
                        'sub_id' : $scope.sub_id,
                        'subject_name' : $scope.subject_name,
                        'sub_code' : $scope.sub_code,
                        'sub_type' : $scope.sub_type,
                        'course_id' : $scope.course_id,
                        'total_hours' : $scope.total_hours,
                        'credit_hours' : $scope.credit_hours
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.message.message);
                    var course=$filter('filter')($scope.courseData,{ID:$scope.course_id},true);
                    if($scope.cou_sub_id){
                        var data1=$filter('filter')($scope.viewData,{ID:$scope.cou_sub_id},true);
                        data1[0].NAME=$scope.subject_name;
                        data1[0].SUB_ID=$scope.sub_id;
                        data1[0].CODE=$scope.sub_code;
                        data1[0].TYPE=$scope.sub_type;
                        data1[0].COURSE_ID=$scope.course_id;
                        data1[0].COURSE_NAME=course[0].NAME;
                        data1[0].TOTAL_HOURS=$scope.total_hours;
                        data1[0].CREDIT_HOURS=$scope.credit_hours;
                    }else{
                        $scope.viewData.push({ID:return_data.data.message.COUSRE_SUB_ID,NAME:$scope.subject_name,SUB_ID:return_data.data.message.SUBJECTID,CODE:$scope.sub_code,TYPE:$scope.sub_type,TOTAL_HOURS:$scope.total_hours,CREDIT_HOURS:$scope.credit_hours,COURSE_ID:$scope.course_id,COURSE_NAME:course[0].NAME});
                    }
                });
            }

            $scope.deleteSubject=function(id,subID,$index){
                if(id){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(id){
                            $http({
                            method : "DELETE",
                            url : $localStorage.service+"AcademicsAPI/subjectDetail",
                            params : {'CS_ID' : id,'subID':subID},
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