import { Stack } from "expo-router";

export default function Layout(){
    return(
        <Stack screenOptions={{
            contentStyle: { backgroundColor: "#24293d" },
            headerStyle: { backgroundColor: "#24293d" },
        }}>
            <Stack.Screen name="Home" options={{headerShown: false}}/>
            <Stack.Screen name="Khatam" options={{headerShown: false}}/>
            <Stack.Screen name="Tasbeeh" options={{headerShown: false}}/>
            <Stack.Screen name="CompleteOrMissing" options={{headerShown: false}}/>
            <Stack.Screen name="Login" options={{headerShown: false}}/>
            <Stack.Screen name="QadhaSalaah" options={{headerShown: false}}/>

            
        </Stack>
    )
}