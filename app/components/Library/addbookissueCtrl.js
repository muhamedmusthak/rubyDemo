angular
    .module('altairApp')
    .controller('addbookissueCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$resource',
        '$filter',
        '$compile',
        '$location',
        function ($scope,$rootScope,$timeout,$resource,$filter,$compile,$location) {
            
            $scope.bookDetails=[];
            $scope.tableView_data=[];
            $scope.employee_data=[];
            $resource('app/components/Library/book_details.json')
            .query()
            .$promise
            .then(function(book_data) {
                $scope.bookDetails.push(book_data);
            });

            $resource('app/components/employeemanagement/employee_list.json')
            .query()
            .$promise
            .then(function(emp_data) {
                $scope.employee_data.push(emp_data);
            });

            $scope.selectize_dept_options = ["Computer Science and Engineering", "Information Technology","Electrical and Electronics Engineering","Civil Engineering","Mechanical Engineering"];
            $scope.selectize_dept_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Department'
            };
            $scope.selectize_category_options = ["Student","Employee"];
            $scope.selectize_category_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Resident'
            };
            $scope.selectize_subject_options = ["Data Structures and Algorithms", "Computer Networking","Laws Of Thermodynamics","Electronic Circuits","Computer Programming","Basic civil and mechanical engineering"];
            $scope.selectize_subject_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Batch'
            };

            $scope.selectize_employee_option = $scope.bookDetails;
            $scope.selectize_employee_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Employee',
                valueField: 'id',
                labelField: 'user_name',
                onInitialize: function(selectize){
                    selectize.on('change', function(val) {
                        var empReturndata=$filter('filter')($scope.employee_data[0], {id : parseInt(val)}, true);
                        // console.log(empReturndata,'fsdfsd');
                        if(empReturndata[0]){
                         $scope.selectize_dept=[empReturndata[0].Dept];
                         $scope.selectize_subject=[empReturndata[0].batch];
                        }
                        $('#page_content_inner').trigger('click');
                    });
                }
            };
            $scope.selectize_student_option = $scope.bookDetails;
            $scope.selectize_student_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Student',
                valueField: 'id',
                labelField: 'user_name',
                onInitialize: function(selectize){
                    selectize.on('change', function(val) {
                        
                    });
                }
            };
        }
    ]);

    //     angular
    // .module('altairApp')
    // .controller('addbookissueCtrl', [
    //     '$scope',
    //     '$rootScope',
    //     '$timeout',
    //     '$resource',
    //     '$filter',
    //     '$compile',
    //     '$location',
    //     function ($scope,$rootScope,$timeout,$resource,$filter,$compile,$location) {
    //         $scope.bookDetails=[];
    //         $scope.tableView_data=[];
    //          $resource('app/components/Library/book_details.json')
    //             .query()
    //             .$promise
    //             .then(function(book_data) {
    //                 $scope.bookDetails.push(book_data);
    //             });

    //         $scope.getBookDetails=function(book_id){
    //             console.log('book_id',book_id);
    //             var Return_Data=$filter('filter')($scope.bookDetails, {id : book_id});
    //             $scope.tableView_data = Return_Data;
    //             console.log($scope.tableView_data,'$scope.tableView_data');
    //         }


    //         $scope.selectize_employee_options = $scope.employeeData;
    //         $scope.selectize_employee_config = {
    //             create: false,
    //             maxItems: 1,
    //             placeholder: 'Select',
    //             valueField: 'id',
    //             labelField: 'user_name',
    //             onInitialize: function(selectize){
    //                 selectize.on('change', function() {
    //                     console.log('change');
    //                 });
    //             }
    //         };
    //         $scope.selectize_resident_options = ['Student','Employee'];
    //         $scope.selectize_resident_config = {
    //             create: false,
    //             maxItems: 1,
    //             placeholder: 'Select'
    //         };
    //     }
    // ]);