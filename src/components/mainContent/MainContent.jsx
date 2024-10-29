import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import PrayerQuran from '../prayar/PrayerQuran';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
//time & date
import moment from 'moment';
import "moment/dist/locale/ar-sa";
moment.locale('ar-EG');

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
    }),
}));

export default  function MainContent() {
    //State
    const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
    //state timings remaing||moment Time
    const [momentTime, setMomentTime] = useState("");
    //state timings
    const [timings , setTimings] =useState({
        "Fajr": "05:17",
        "Dhuhr": "12:41",
        "Asr": "16:14",
        "Maghrib": "18:55",
        "Isha": "20:04",
    });
    //state selectCity
    const [selectCity, setSelectCity] = useState(
        { displayName: " مصر", apiName:" egypt", }
    );
    //avilbleCity
    const avilbleCity = [
        { displayName: " مصر", apiName:" egypt", },
        { displayName: " الإسكندرية", apiName:" Alexandria", },
        { displayName: " مرسى مطروح", apiName:" Marsa Matrouh", },
    ]
    //prayerNameArray
    const prayerNameArray = [
        {key:"Fajr", displayName:"الفجر"},
        {key:"Dhuhr", displayName:"الظهر"},
        {key:"Asr", displayName:"العصر"},
        {key:"Maghrib", displayName:"المغرب"},
        {key:"Isha", displayName:"العشاء"},
    ]
    //today
    const [today ,setToday] = useState("");
    //Timer
    const [timer, setTimer] = useState(10);

    const getTimings =async()=>{
        // console.log("api")
        const resData = await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectCity.apiName}`);
        // console.log("hhhhh", resData.data.data.timings);
        setTimings(resData.data.data.timings);
    }
    useEffect(()=>{
        getTimings();
    } ,[selectCity])

    useEffect(()=>{
        const todayDate = moment();
        setToday(todayDate.format('Do MMMM YYYY | h:mm'));
        // console.log("today" , todayDate.format('dddd, MMMM Do YYYY'));

        let interval =setInterval(()=>{
            // setTimer((timer)=>{
            //     return timer-1;
            // });
            // console.log("jjjjjjjj")
            setupCountdownTimer();
        },1000)
        return ()=>{
            clearInterval(interval);
        }
    },[timings])
    
    const setupCountdownTimer = ()=>{
        const momentNew = moment();
        let prayerIndex = 0;
        if(
            momentNew.isAfter(moment(timings["Fajr"],"hh:mm")) && momentNew.isBefore(moment(timings["Dhuhr"],"hh:mm"))
        ){
            prayerIndex = 1
            // console.log("prayer Dhuhr");
        }else if(
            momentNew.isAfter(moment(timings["Dhuhr"],"hh:mm")) && momentNew.isBefore(moment(timings["Asr"],"hh:mm"))
        ){
            prayerIndex = 2
            // console.log("prayer Asr");
        }else if(
            momentNew.isAfter(moment(timings["Asr"], "hh:mm")) && momentNew.isBefore(moment(timings["Maghrib"] , "hh:mm"))
        ){
            prayerIndex = 3
            // console.log("prayer Maghrib");
        }else if(
            momentNew.isAfter(moment(timings["Maghrib"], "hh:mm")) && momentNew.isBefore(moment(timings["Isha"], "hh:mm"))
        ){
            prayerIndex = 4
            // console.log("prayer Isha");
        }else{
            prayerIndex = 0
            // console.log("prayer Fajr");
        }
        setNextPrayerIndex (prayerIndex);
        // console.log( momentNew.isBefore(moment(timings["Asr"],"hh:mm")))

        //Now after knowing the next prayer index
        const nextPrayerObject = prayerNameArray[prayerIndex];
        const nextPrayerTime = timings[nextPrayerObject.key];         //دة عبارة عن string 
        const nextPrayerTimeMoment = moment(nextPrayerTime , "hh:mm ");
        
        const momentTimee= momentNew.diff(moment(nextPrayerTime ,"hh:mm"));  //من خلال الدة الخاصة بالمواقيت وعبارة عن object 
        let momentTime =moment(nextPrayerTime ,"hh:mm").diff(momentNew);

        // console.log(momentTime)
        // console.log("time issssssssssss",nextPrayerTime);

        if(momentTime < 0 ){
            const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNew);
            const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
                moment("00:00:00", "hh:mm:ss")
            );
            const totalDiffernce =midnightDiff + fajrToMidnightDiff;
            momentTime = totalDiffernce;
        }

        const durationRemainingTime = moment.duration(momentTime);
        setMomentTime(
            `${durationRemainingTime.hours()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.seconds()}  `
        );
        //طريقة حل ثانية عشان يعرض الوقت بطريقة صحيحة بدل ما اعمل styel
        // setMomentTime(
        //     `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}  `
        // );

        // console.log("durationRemainingTime" , durationRemainingTime.hours(), durationRemainingTime.minutes(), durationRemainingTime.seconds());

        // const Ishe = timings.Dhuhr;
        // const IsheMoment = moment(Ishe , "hh:mm")
        // console.log(momentNew.isBefore(IsheMoment));
    };

    const handleCityChange = (event) => {
        const cityObject =avilbleCity.find((city)=>{return city.apiName == event.target.value});
        // console.log(event.target.value);
        setSelectCity(cityObject)
    };
return <>
    <Box sx={{ flexGrow: 1 }}>
        {/* start top row */}
        <Grid container spacing={2} style={{padding:"30px"}}>
            <Grid size={6}>
                <div style={{color:"white"}}>
                    <h2>{today}</h2>
                    <h1>{selectCity.displayName}</h1>
                    {/* <h4>{timer}</h4> */}
                </div>
            </Grid>
            <Grid size={6}>
                <div style={{color:"white"}}>
                    <h2>متبقي حتى صلاة {prayerNameArray[nextPrayerIndex].displayName}</h2>
                    <h1 style={{direction:"ltr" , textAlign:"right"}}> {momentTime}</h1>
                    {/* <h1>{momentTime}</h1> */}
                </div>
            </Grid>
        </Grid>
        {/* end top row */}
        <Divider style={{borderColor:"white", opacity:"0.1" ,width:"100%" ,margin:"auto"}} />

        {/* start Cards */}
        <Stack style={{paddingTop:"30px"}} direction="row" justifyContent="space-around">
            {/* <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 12, md: 12 }}>
                    {Array.from(Array(5)).map((_, index) => (
                        <Grid key={index} size={{ xs: 12, sm: 6, md: 2 }}>
                            <PrayerQuran namePrayer="الفجر" timePrayer={timings.Fajr} imgPrayer="public/img/imgPrayer1.png"/>
                        </Grid>
                    ))}
                </Grid>
            </Box> */}

            {/* <Box sx={{ width: '100%' }}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 3, md: 3 }}>
                    <Grid  xs={12} sm={4} md={4}>
                        <PrayerQuran namePrayer="الفجر" timePrayer={timings.Fajr} imgPrayer="public/img/imgPrayer1.png"/>
                    </Grid>
                    <Grid xs={12} sm={4} md={4}>
                        <PrayerQuran namePrayer="الظهر" timePrayer={timings.Dhuhr} imgPrayer="public/img/imgPrayer2.png"/>
                    </Grid>
                    <Grid xs={12} sm={4} md={4}>
                        <PrayerQuran namePrayer="العصر" timePrayer={timings.Asr} imgPrayer="public/img/imgPrayer3.png"/>
                    </Grid>
                    <Grid xs={12} sm={4} md={4}>
                        <PrayerQuran namePrayer="المغرب" timePrayer={timings.Maghrib} imgPrayer="public/img/imgPrayer1.png"/>
                    </Grid>
                    <Grid xs={12} sm={4} md={4}>
                        <PrayerQuran namePrayer="العشاء" timePrayer={timings.Isha} imgPrayer="public/img/imgPrayer3.png"/>
                    </Grid>
                </Grid>
            </Box> */}
            
            <PrayerQuran namePrayer="الفجر" timePrayer={timings.Fajr} imgPrayer="public/img/imgPrayer1.png"/>
            <PrayerQuran namePrayer="الظهر" timePrayer={timings.Dhuhr} imgPrayer="public/img/imgPrayer2.png"/>
            <PrayerQuran namePrayer="العصر" timePrayer={timings.Asr} imgPrayer="public/img/imgPrayer3.png"/>
            <PrayerQuran namePrayer="المغرب" timePrayer={timings.Maghrib} imgPrayer="public/img/imgPrayer1.png"/>
            <PrayerQuran namePrayer="العشاء" timePrayer={timings.Isha} imgPrayer="public/img/imgPrayer3.png"/>
        </Stack>
        {/* end Cards */}

        {/* start select row */}
        <Stack direction="row"  justifyContent={"center"}>
            <Box sx={{ minWidth: "20%" , marginTop:"25px" ,borderColor:"white"}} >
                <FormControl sx={{width:"100%"}}>
                    <InputLabel id="demo-simple-select-label" sx={{color:"white"}}> <span sx={{color:"white"}}>المدينة</span></InputLabel>
                        <Select sx={{color:"white"}} labelId="demo-simple-select-label" id="demo-simple-select" label="Age" onChange={handleCityChange}>
                            
                            {avilbleCity.map((city)=>{
                                return <MenuItem value={city.apiName} key={city.apiName}>{city.displayName}</MenuItem>
                                })
                            }
                        </Select>
                </FormControl>
            </Box>
        </Stack>
        {/* end select row */}
    </Box>
</>
}
