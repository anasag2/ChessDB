import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import {Link} from 'expo-router';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text classname="test-3xl">The Chess DB!</Text>
      <StatusBar style="auto"/>
      <Link href="/profile" style={{color: 'blue'}}>Profile
      </Link>
    </View>
  );
}