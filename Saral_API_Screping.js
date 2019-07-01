var fs = require('fs');
var axios = require('axios');
var readline = require('readline-sync');
fs.exists( __dirname + '/courses.json',(exists) =>{
    if(!exists){
        axios.get("http://saral.navgurukul.org/api/courses")
        .then(function(response){
            // console.log(response)
            var courses = response.data
            // console.log(courses);
            fs.writeFileSync('courses.json',JSON.stringify(courses,null,2))
        })
        .catch(function(error){
            console.log(error.response.status)
        })
    }else{
        var data=fs.readFileSync('courses.json')
        data = JSON.parse(data)
        // console.log(data.availableCourses);
        var courses_name = data.availableCourses;
        var id_list = [];
        for(i in courses_name){
            console.log(i,courses_name[i].name);
            id_list.push(courses_name[i].id);
        }
        var user = readline.question('input courses number  ');
        for (j in id_list){
            if (user == j){
                // console.log(id_list[j]);
                var courses_id = id_list[j];
                axios.get("http://saral.navgurukul.org/api/courses/"+courses_id+"/exercises")
                .then(function(response){
                    var courses_exer = response.data
                    var Exercises = courses_exer.data;
                    var slug_list = [];
                    var number_list = [];
                    var number = 0;
                    console.log(" ")
                    for (a of Exercises){
                        slug_list.push(a.slug);
                        number_list.push(number);
                        console.log(number,a.name);
                       
                        float_number = .1
                        var childExercises = a.childExercises;
                        for (b of childExercises){
                            console.log('   ',number+float_number, b.name)
                            slug_list.push(b.slug);
                            number_list.push(number+float_number);
                            float_number+=.1
                        } number+=1
                    }
                    // console.log(slug_list);
                    var user_2 = readline.question('input exercises number  ');
                    for (c in slug_list){
                        if (user_2 == number_list[c]){
                            var slug = slug_list[c];
                            console.log(" ")
                            axios.get("http://saral.navgurukul.org/api/courses/"+courses_id+"/exercise/getBySlug?slug="+slug)
                            .then(function(response){
                                var cantent = response.data
                                console.log(cantent.content);
                            })                       
                        }
                    }                  
                })
            }
        }
    }
});
