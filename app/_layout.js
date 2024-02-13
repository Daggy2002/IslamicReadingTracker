import { Stack } from "expo-router";

export default function Layout(){
    return(
        <Stack screenOptions={{
            contentStyle: { backgroundColor: "#24293d" },
            headerStyle: { backgroundColor: "#24293d" },
            statusBarHidden: true,
            statusBarTranslucent: true,
        }}>
            <Stack.Screen name="Khatam" options={{headerShown: false}}/>
            <Stack.Screen name="Tasbeeh" options={{headerShown: false}}/>
            <Stack.Screen name="CompleteOrMissing" options={{headerShown: false}}/>
            <Stack.Screen name="Login" options={{headerShown: false}}/>
            <Stack.Screen name="QadhaSalaah" options={{headerShown: false}}/>
            <Stack.Screen name="QadhaFast" options={{headerShown: false}}/>
            <Stack.Screen name="Yaseen" options={{headerShown: false}}/>

            
        </Stack>
    )
}