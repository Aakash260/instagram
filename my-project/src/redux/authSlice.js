import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
    name:'auth',
    initialState:{
        suggestedUsers:[],
        user:null,
        userProfile:null,
    },
    reducers:{
        setAuthUser(state,action){
            
            state.user=action.payload;
        },
        setSuggestedUsers:(state,action) => {
            state.suggestedUsers = action.payload;
        },
        setUserProfile:(state,action) => {
            state.userProfile = action.payload;
        },
    }
})

export const {setAuthUser,setSuggestedUsers,setUserProfile} = authSlice.actions;

export default authSlice.reducer;