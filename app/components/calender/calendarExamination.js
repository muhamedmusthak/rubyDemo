angular
    .module('rubycampusApp')
    .controller('examination', [
        '$scope',
        'uiCalendarConfig',
        '$filter',
        '$resource',
        'user_data',
        'DTOptionsBuilder',
        'DTColumnDefBuilder',
        '$compile',
        '$timeout',
        function ($scope,uiCalendarConfig,$filter,$resource,user_data, DTOptionsBuilder, DTColumnDefBuilder,$compile,$timeout) {
            $scope.dtOptions = DTOptionsBuilder
                .newOptions()
                .withDOM("<'dt-uikit-header'<'uk-grid'<'uk-width-medium-2-3'l><'uk-width-medium-1-3'f>>>" +
                    "<'uk-overflow-container'tr>" +
                    "<'dt-uikit-footer'<'uk-grid'<'uk-width-medium-3-10'i><'uk-width-medium-7-10'p>>>")
                .withOption('createdRow', function(row, data, dataIndex) {
                    // Recompiling so we can bind Angular directive to the DT
                    $compile(angular.element(row).contents())($scope);
                })
                .withOption('headerCallback', function(header) {
                    if (!$scope.headerCompiled) {
                        // Use this headerCompiled field to only compile header once
                        $scope.headerCompiled = true;
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
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        
                       null
                    ]
                })
                .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });
                $scope.dtColumnDefs = [
                    DTColumnDefBuilder.newColumnDef(0).withTitle('S.No'),
                    DTColumnDefBuilder.newColumnDef(1).withTitle('Exam'),
                    DTColumnDefBuilder.newColumnDef(2).withTitle('Assessment'),
                    DTColumnDefBuilder.newColumnDef(3).withTitle('Course'),
                    DTColumnDefBuilder.newColumnDef(4).withTitle('Batch'),
                    DTColumnDefBuilder.newColumnDef(5).withTitle('Subject'),
                    // DTColumnDefBuilder.newColumnDef(6).withTitle('Max.Mark'),
                    DTColumnDefBuilder.newColumnDef(7).withTitle('Date'),
                    // DTColumnDefBuilder.newColumnDef(8).withTitle('From'),
                    // DTColumnDefBuilder.newColumnDef(9).withTitle('To'),
                    DTColumnDefBuilder.newColumnDef(10).withTitle('Action'),

                ];
            $scope.user_data=user_data[0];
            // masked inputs
            var $maskedInput = $('.masked_input');
            if($maskedInput.length) {
                $maskedInput.inputmask();
            }

            $scope.department=[];
            $scope.course = [];
            $scope.batch = [];
            
            $scope.selectize_config = {
                create: false,
                maxItems: 1
            };
            $resource('data/calendar/course.json')
            .query()
            .$promise
            .then(function(response) {
                $scope.course = response;
            });
            $resource('data/calendar/courseBatch.json')
            .query()
            .$promise
            .then(function(response) {
                $scope.batchArray = response;
            });
            $scope.course_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Course...',
                valueField: 'id',
                labelField: 'course_name',
                onInitialize: function(selectize){
                   selectize.on('change', function(value) {
                            if(value==''){
                                $scope.batch=[]
                            }else {
                               var data=$filter('filter')($scope.batchArray, {course_id : value});
                               if (data.length > 0)
                                
                                $scope.batch.push(data);
                            }
                        });
                    
                }
            };
            $scope.batch_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Batch...',
                valueField: 'id',
                labelField: 'cBatch_name',
            };
            $scope.get_id = [];
            $resource('app/components/academics/examination/setassessment.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    $scope.get_id.push(dt_data);
                });
                $scope.selectize_assessment_options = $scope.get_id;
                $scope.selectize_assessment_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Assessment',
                    valueField: 'id',
                    labelField: 'name',
                    onInitialize: function(val){
                        console.log(val);
                    }
                };

                $scope.get_id1 = [];
                $resource('app/components/academics/examination/setexam.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    $scope.get_id1.push(dt_data);
                });
                $scope.selectize_exam_options = $scope.get_id1;
                $scope.selectize_exam_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Exam',
                    valueField: 'id',
                    labelField: 'name',
                    onInitialize: function(val){
                        console.log(val);
                    }
                };

            var modal = UIkit.modal("#modal_header_footer");
            $scope.selectize_config = {
                create: false,
                maxItems: 1
            };
            $scope.forms_advanced={
                startTime:"00:00",
                endTime:"00:00"
            };
            $scope.modelhide=function(){
                modal.hide();
                $scope.forms_advanced={
                    startTime:"00:00",
                    endTime:"00:00"
                };
                $scope.input_default="";
                $scope.forms_advanced.day="";
                $('#calendar_colors_wrapper').find('input').val("")
            }
            $scope.randID_generator = function() {
                var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                return randLetter + Date.now();
            };

            $scope.color_picker = function(object,pallete) {
                if(object) {
                    var cp_id = $scope.randID_generator(),
                        cp_pallete = pallete ? pallete : ['#e53935','#d81b60','#8e24aa','#5e35b1','#3949ab','#1e88e5','#039be5','#0097a7','#00897b','#43a047','#689f38','#ef6c00','#f4511e','#6d4c41','#757575','#546e7a'],
                        cp_pallete_length = cp_pallete.length,
                        cp_wrapper = $('<div class="cp_altair" id="'+cp_id+'"/>');

                    for(var $i=0;$i<cp_pallete_length;$i++) {
                        cp_wrapper.append('<span data-color=' + cp_pallete[$i] + ' style="background:' + cp_pallete[$i] + '"></span>');
                    }

                    cp_wrapper.append('<input type="hidden">');

                    $('body').on('click', '#T1489421677871 span',function() {
                        $(this)
                            .addClass('active_color')
                            .siblings().removeClass('active_color')
                            .end()
                            .closest('.cp_altair').find('input').val($(this).attr('data-color'));
                    });
                    return object.append(cp_wrapper);

                }
            };
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
                end_date.options.minDate = $dp_start.val();
                console.log($dp_start.val(),"$dp_start.val()")
            });

            $dp_end.on('change',function() {
                start_date.options.maxDate = $dp_end.val();
            });
            $scope.toggle=true;
            $scope.openTable=function(){
                $scope.toggle=!$scope.toggle;
            }
            $scope.addEvent=function(){
                var COURSE_NAME=$filter('filter')($scope.course, {id: $scope.course2});
                var BATCH_NAME=$filter('filter')($scope.batchArray, {id : $scope.batch2});
                var eventData,eventColor = $('#calendar_colors_wrapper').find('input').val();
                var temp_start_date=$scope.forms_advanced.dp_start.split(".");
                var start_dateWithTime=temp_start_date[2]+"-"+eval(temp_start_date[1])+"-"+ temp_start_date[0]+" "+$scope.forms_advanced.startTime;
                var start_dateWithEnd=temp_start_date[2]+"-"+eval(temp_start_date[1])+"-"+ temp_start_date[0]+" "+$scope.forms_advanced.endTime;
                
                eventData = {
                    title : $scope.forms_advanced.input_default,
                    start : moment(start_dateWithTime, ['YYYY-MM-DD HH:mm A']).locale('en').format('YYYY-MM-DD HH:mm A'),
                    end : moment(start_dateWithEnd, ['YYYY-MM-DD HH:mm A']).locale('en').format('YYYY-MM-DD HH:mm A'),
                    _id : $scope.calendar_events.length+1,
                    course_id : $scope.course2,
                    course_name : COURSE_NAME[0].course_name,
                    batch_id : $scope.batch2,
                    batch_name : BATCH_NAME[0].cBatch_name
                };
                $scope.calendar_events.push(eventData);
                uiCalendarConfig.calendars.myCalendar.fullCalendar('rerenderEvents'); // stick? = true
                $scope.modelhide();
                
                $scope.course2=[];
                $scope.batch2=[];
                $scope.input_default="";
                $scope.forms_advanced.startTime="";
                $scope.forms_advanced.endTime="";
                // $('#calendar_colors_wrapper').find('input').val("")
                // console.log($scope.calendar_events,"$scope.calendar_events");
            }
            $scope.calendarColorPicker = $scope.color_picker($('<div id="calendar_colors_wrapper"></div>')).prop('outerHTML');
            $scope.editEvent=function(event){
                // console.log(typeof event!="undefined");
                if (typeof event!="undefined"){
                    $scope.forms_advanced.input_default=event.title;
                    $scope.forms_advanced.dp_start= $filter('date')(new Date(event.start.split(" ")[0]), "dd.MM.yyyy");;
                    $scope.forms_advanced.startTime=event.start.split(" ")[1]+" "+event.start.split(" ")[2];
                    $scope.forms_advanced.endTime=event.end.split(" ")[1]+" "+event.end.split(" ")[2];
                    $scope.course2=event.course_id;
                    $scope.batch2=event.batch_id;
                    $scope.checkValiddata();
                }
            }
            $scope.deleteEvent=function(event){
                // console.log(parentkey, childkey, event)
                if (typeof event!="undefined") {
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        // console.log("true");
                        $scope.calendar_events.splice(event, 1);
                        // console.log($scope.events_list,"$scope.events_list");
                        uiCalendarConfig.calendars.myCalendar.fullCalendar('rerenderEvents');
                        
                    },function(){
                    }, {
                        labels: {
                            'Ok': 'Ok'
                        }
                    });
                }
            }
            $scope.checkValiddata=function(start, end){
                    $scope.course2=[];
                    $scope.batch2=[];
                    $scope.input_default="";
                    $scope.forms_advanced.startTime="00:00 am";
                    $scope.forms_advanced.endTime="00:00 am";
                    var modal = UIkit.modal("#modal_header_footer");
                    if ( modal.isActive() ) {
                        modal.hide();
                    } else {
                        // $scope.dp_start='';
                        // $scope.dp_end='';
                        if (start || end) {
                            $scope.dp_start=start._d.getDate()+"."+eval(start._d.getMonth()+1)+"."+start._d.getFullYear();
                            // console.log($scope.dp_start);
                            end_date.options.minDate = $scope.dp_start;
                            $scope.dp_end=end._d.getDate()+"."+eval(end._d.getMonth()+1)+"."+end._d.getFullYear();
                            $scope.addEvents={};
                            $scope.addEvents={start_date : start, end : end};    
                        };
                        modal.show();
                    }
            }
            $scope.getdateobject=function(date){
                // console.log(moment(date));
                return moment(date)._d;
            }
            $scope.uiConfig = {
                calendar: {
                    header: {
                        left: 'title',
                        center: '',
                        right: 'month,agendaWeek,agendaDay,listWeek prev,next'
                    },
                    // viewRender: function(view) {
                    //     var title = "<h1 style='font-size:24px;line-height:48px'>Examination Schedules</h1>";
                    //     $(".fc-left").html(title);
                    // },
                    buttonIcons: {
                        prev: 'md-left-single-arrow',
                        next: 'md-right-single-arrow',
                        prevYear: 'md-left-double-arrow',
                        nextYear: 'md-right-double-arrow'
                    },
                    buttonText: {
                        today: ' ',
                        month: ' ',
                        week: ' ',
                        day: ' '
                    },
                    defaultView:'month',
                    columnFormat:'ddd',
                    allDaySlot: false,
                    allDayText: "all-day",
                    scrollTime: "06:00:00",
                    slotDuration: "00:30:00",
                    minTime: "09:00:00",
                    maxTime: "18:00:00",
                    slotEventOverlap: !0,
                    aspectRatio: 2.1,
                    defaultDate: moment(),
                    selectable: true,
                    selectHelper: true,
                    displayEventEnd:true,
                    disableResizing:true,
                    eventResize: function(event, delta, revertFunc) {
                            revertFunc();
                    },
                    eventClick: function(event, jsEvent){
                        uiCalendarConfig.calendars.myCalendar.fullCalendar('changeView', 'listWeek')
                    },
                    select: function (start, end) {
                        $scope.checkValiddata(start, end);
                    },
                    eventDrop:function( event, delta, revertFunc, jsEvent, ui, view ) {
                        UIkit.modal.confirm('Are you sure to move?', function(e) {
                            // console.log("true");
                        },function(){
                            revertFunc();
                        }, {
                            labels: {
                                'Ok': 'Ok'
                            }
                        });
                    },
                    editable: true,
                    eventLimit: true,
                    disableDragging:true,
                    timeFormat: '(hh:mm a)',
                    timezone:'local'
                }
            };
            $scope.events_list=[
            {
                course2:1,
                course2_name:"Information Technology",
                batch2:1, 
                batch2_name:'CSE A',events:[
                    { 
                        "exam": "Term 1",
                        "assessment": "FA 1",
                        "max_mark":100,
                        "subject": "Applied Thermodynamics Engineering",
                        "start": "2017-04-08 09:00 AM",
                        "end": "2017-04-08 14:00 PM",
                        "description": "Test World Hello 123",
                        "_id": 1,
                        "backgroundColor":"#ff0000"
                    },
                    { 
                        "exam": "Term 1",
                        "assessment": "FA 1",
                        "max_mark":100,
                        "subject": "English", 
                        "start": "2017-03-31 09:00 AM", 
                        "end": "2017-03-31 14:00 PM", 
                        "description": "Test World Hello 123", 
                        "_id": 2 
                    },
                    { 
                        "exam": "Term 1",
                        "assessment": "FA 1",
                        "max_mark":100,
                        "subject": "Maths", 
                        "start": "2017-04-01 09:00 AM", 
                        "end": "2017-04-01 14:00 PM", 
                        "description": "Test World Hello 123", 
                        "_id": 3 
                    },
                    { 
                        "exam": "Term 1",
                        "assessment": "FA 1",
                        "max_mark":100,
                        "subject": "Science", 
                        "start": "2017-04-02 09:00 AM", 
                        "end": "2017-04-02 14:00 PM", 
                        "description": "Test World Hello 123", 
                        "_id": 4 
                    },
                    { 
                        "exam": "Term 1",
                        "assessment": "FA 1",
                        "max_mark":100,
                        "subject": "Social Science", 
                        "start": "2017-04-03 09:00 AM", 
                        "end": "2017-04-03 14:00 PM", 
                        "description": "Test World Hello 123", 
                        "_id": 5 
                    }]
            },
            {
                course2:3,
                course2_name:"Mechanical Engineering",
                batch2:3, 
                batch2_name:'CSE C',events:[
                    { 
                        "exam": "Term 1",
                        "assessment": "FA 1",
                        "max_mark":100,
                        "subject": "Applied Thermodynamics Engineering",
                        "start": "2017-04-08 09:00 AM",
                        "end": "2017-04-08 14:00 PM",
                        "description": "Test World Hello 123",
                        "_id": 1,
                        "backgroundColor":"#ff0000"
                    },
                    { 
                        "exam": "Term 1",
                        "assessment": "FA 1",
                        "max_mark":100,
                        "subject": "English", 
                        "start": "2017-03-31 09:00 AM", 
                        "end": "2017-03-31 14:00 PM", 
                        "description": "Test World Hello 123", 
                        "_id": 2 
                    },
                    { 
                        "exam": "Term 1",
                        "assessment": "FA 1",
                        "max_mark":100,
                        "subject": "Maths", 
                        "start": "2017-04-01 09:00 AM", 
                        "end": "2017-04-01 14:00 PM", 
                        "description": "Test World Hello 123", 
                        "_id": 3 
                    },
                    { 
                        "exam": "Term 1",
                        "assessment": "FA 1",
                        "max_mark":100,
                        "subject": "Science", 
                        "start": "2017-04-02 09:00 AM", 
                        "end": "2017-04-02 14:00 PM", 
                        "description": "Test World Hello 123", 
                        "_id": 4 
                    },
                    { 
                        "exam": "Term 1",
                        "assessment": "FA 1",
                        "max_mark":100,
                        "subject": "Social Science", 
                        "start": "2017-04-03 09:00 AM", 
                        "end": "2017-04-03 14:00 PM", 
                        "description": "Test World Hello 123", 
                        "_id": 5 
                    }]
            },
            {
                course2:2,
                course2_name:"Computer Science Engineering",
                batch2:2, 
                batch2_name:'CSE B',events:[
                    { 
                        "exam": "Term 1",
                        "assessment": "FA 1",
                        "max_mark":100,
                        "subject": "Applied Thermodynamics Engineering",
                        "start": "2017-04-08 09:00 AM",
                        "end": "2017-04-08 14:00 PM",
                        "description": "Test World Hello 123",
                        "_id": 1,
                        "backgroundColor":"#ff0000"
                    },
                    { 
                        "exam": "Term 1",
                        "assessment": "FA 1",
                        "max_mark":100,
                        "subject": "English", 
                        "start": "2017-03-31 09:00 AM", 
                        "end": "2017-03-31 14:00 PM", 
                        "description": "Test World Hello 123", 
                        "_id": 2 
                    },
                    { 
                        "exam": "Term 1",
                        "assessment": "FA 1",
                        "max_mark":100,
                        "subject": "Maths", 
                        "start": "2017-04-01 09:00 AM", 
                        "end": "2017-04-01 14:00 PM", 
                        "description": "Test World Hello 123", 
                        "_id": 3 
                    },
                    { 
                        "exam": "Term 1",
                        "assessment": "FA 1",
                        "max_mark":100,
                        "subject": "Science", 
                        "start": "2017-04-02 09:00 AM", 
                        "end": "2017-04-02 14:00 PM", 
                        "description": "Test World Hello 123", 
                        "_id": 4 
                    },
                    { 
                        "exam": "Term 1",
                        "assessment": "FA 1",
                        "max_mark":100,
                        "subject": "Social Science", 
                        "start": "2017-04-03 09:00 AM", 
                        "end": "2017-04-03 14:00 PM", 
                        "description": "Test World Hello 123", 
                        "_id": 5 
                    }]
            }];
            $scope.calendar_events=[];
            var count=1;
            angular.forEach($scope.events_list, function(value, keys){
                angular.forEach(value.events, function(val, key){
                    val._id=count;
                    val.course_id=value.course2;
                    val.course_name=value.course2_name;
                    val.batch_id=value.batch2;
                    val.batch_name=value.batch2_name;
                    $scope.calendar_events.push(val);
                    count++;
                    // console.log(val);
                })
            });
            $scope.eventSources = [$scope.calendar_events];

        }
    ]);


