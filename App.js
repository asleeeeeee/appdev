import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ImageBackground, FlatList, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import PlayerScreen from './playerScreen';
import Playlist from './playlist';


const members = [
  { name: 'CHOI HYUNSUK', image: require('./assets/hyunsuk.jpg') },
  { name: 'PARK JIHOON', image: require('./assets/jihoon.jpg') },
  { name: 'KIM JUNKYU', image: require('./assets/junkyu.jpg') },
  { name: 'YOSHINORI', image: require('./assets/yoshi.jpg') },
  { name: 'ASAHI', image: require('./assets/asahi.jpg') },
  { name: 'YOON JAEHYUK', image: require('./assets/jaehyuk.jpg') },
  { name: 'PARK JEONGWOO', image: require('./assets/jeongwoo.jpg') },
  { name: 'HARUTO', image: require('./assets/haruto.jpg') },
  { name: 'KIM DOYOUNG', image: require('./assets/doyoung.jpg') },
  { name: 'SO JUNGHWAN', image: require('./assets/junghwan.jpg') },
];


const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={styles.backgroundImage}
      blurRadius={5}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('VinylScreen', { showVinylScreen: true })}
        >
          <Image
            source={require('./assets/group-photo.jpg')}
            style={styles.groupImage}
          />
        </TouchableOpacity>
        <Text style={styles.title}>TREASURE MEMBERS</Text>
      </View>


      <ScrollView contentContainerStyle={styles.membersList}>
        {members.map((member, index) => (
          <TouchableOpacity
            key={index}
            style={styles.memberItem}
            onPress={() =>
              navigation.navigate('MemberDetails', { member })
            }
          >
            <Image source={member.image} style={styles.memberImage} />
            <Text style={styles.memberName}>{member.name}</Text>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </ImageBackground>
  );
};

const VinylScreen = ({ route, navigation }) => {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={styles.backgroundImage}
      blurRadius={5}
    >
      <ScrollView contentContainerStyle={styles.vinylScreen}>
        {members.map((member, index) => (
          <TouchableOpacity
            key={index}
            style={styles.vinylCard}
            onPress={() => navigation.navigate('Playlist', { member })}
          >
            <VinylDisc memberImage={member.image} />
            <View style={{ marginTop: 15 }}></View>
            <Text style={styles.memberName}>{member.name}</Text>

          </TouchableOpacity>
        ))}
      </ScrollView>
    </ImageBackground>
  );
};

const VinylDisc = ({ memberImage }) => {
  return (
    <View style={styles.outerBorder}>
      <Image
        source={memberImage}
        style={styles.vinyl} // No need for the transform
        resizeMode="cover"
      />

    </View>
  );
};



const MemberDetailsScreen = ({ route }) => {
  const { member } = route.params || {};

  let description = 'No description available';

  if (member.name === 'CHOI HYUNSUK') {
    description = `Stage / Birth Name: Choi Hyun-suk (최현석)\nEnglish Name: Danny Choi\nPosition(s): Main Dancer, Main Rapper, Vocalist \nBirthday: April 21st, 1999 \nZodiac Sign: Taurus \nChinese Zodiac Sign: Rabbit \nHeight: 171 cm (5’7”) \nWeight: 58 kg (128 lbs) \nBlood Type: A \nMBTI Type: ENFP \nNationality: Korean`;
  } else if (member.name === 'PARK JIHOON') {
    description = 'Stage Name: Jihoon (지훈) \nBirth Name: Park Jihoon (박지훈) \nEnglish Name: Jun Park \nPosition(s): Main Dancer, Lead Vocalist \nBirthday: March 14th, 2000 \nZodiac Sign: Pisces \nChinese Zodiac Sign: Dragon \nHeight: 178 cm (5’10”) \nWeight: 69 kg (152 lbs) \nBlood Type: B \nMBTI Type: ENTJ \nNationality: Korean';
  } else if (member.name === 'KIM JUNKYU') {
    description = 'Stage Name: Junkyu \nBirth Name: Kim Junkyu (김준규) \nEnglish Name: David Kim \nPosition(s): Leader, Main or Lead Vocalist, Visual \nBirthday: September 9th, 2000 \nZodiac Sign: Virgo \nChinese Zodiac Sign: Dragon \nHeight: 178 cm (5’10″) \nWeight: 65 kg (143 lbs) \nBlood Type: O \nMBTI Type: INFJ \nNationality: Korean';
  } else if (member.name === 'YOSHINORI') {
    description = 'Stage Name: Yoshi (요시) \nBirth Name: Kanemoto Yoshinori (金本芳典) \nKorean Name: Kim Bang-jeon (김방전) \nEnglish Name: Jaden Kanemoto / Jaden Kim \nPosition(s): Main Rapper \nBirthday: May 15th, 2000 \nZodiac Sign: Taurus \nChinese Zodiac Sign: Dragon \nHeight: 179 cm (5’10.5″) \nWeight: 59 kg (130 lbs) \nBlood Type: A \nMBTI Type: INFP \nNationality: Japanese';
  } else if (member.name === 'ASAHI') {
    description = 'Stage Name: Asahi (아사히) \nBirth Name: Hamada Asahi (浜田朝光) \nEnglish Name: Arthur Hamada \nPosition(s): Leader, Vocalist, Visual \nBirthday: August 20th, 2001 \nZodiac Sign: Leo \nChinese Zodiac Sign: Snake \nHeight: 172 cm (5’7.5″) \nWeight: 53 kg (117 lbs) \nBlood Type: AB \nMBTI Type: INFP \nNationality: Japanese';
  } else if (member.name === 'YOON JAEHYUK') {
    description = 'Stage / Birth Name: Yoon Jae-hyuk (윤재혁) \nEnglish Name: Kevin Yoon \nPosition(s): Vocalist \nBirthday: July 23rd, 2001 \nZodiac Sign: Leo \nChinese Zodiac Sign: Snake \nHeight: 178 cm (5’10″) \nWeight: 63 kg (139 lbs) \nBlood Type: O \nMBTI Type: INFP \nNationality: Korean';
  } else if (member.name === 'PARK JEONGWOO') {
    description = 'Stage / Birth Name: Park Jeong-woo (박정우) \nEnglish Name: Justin Park \nPosition(s): Main Vocalist \nBirthday: September 28th, 2004 \nZodiac Sign: Libra \nChinese Zodiac Sign: Monkey \nHeight: 181 cm (5’11″) \nWeight: 70 kg (154 lbs) \nBlood Type: O \nMBTI Type: ISFP \nNationality: Korean';
  } else if (member.name === 'HARUTO') {
    description = 'Stage Name: Haruto (하루토) \nBirth Name: Watanabe Haruto (渡辺春虎) \nEnglish Name: Travis Watanabe \nPosition(s): Main Rapper, Visual \nBirthday: April 5th, 2004 \nZodiac Sign: Aries \nChinese Zodiac Sign: Monkey \nHeight: 183.2 cm (6’0″) \nWeight: 68-70kg (147-149 lbs) \nBlood Type: B \nMBTI Type: ISFP \nNationality: Japanese';
  } else if (member.name === 'KIM DOYOUNG') {
    description = 'Stage Name: Doyoung (도영) \nBirth Name: Kim Do-young (김도영) \nPosition(s): Main Dancer, Vocalist \nBirthday: December 4th, 2003 \nZodiac Sign: Sagittarius \nChinese Zodiac Sign: Goat \nHeight: 177 cm (5’10″) \nWeight: 58 kg (128 lbs) \nBlood Type: B \nMBTI Type: ENTJ \nNationality: Korean';
  } else if (member.name === 'SO JUNGHWAN') {
    description = 'Stage / Birth Name: So Jung-hwan (소정환) \nEnglish Name: John So \nPosition(s): Lead Dancer, Vocalist, Maknae \nBirthday: February 18th, 2005 \nZodiac Sign: Aquarius \nChinese Zodiac Sign: Rooster \nHeight: 180.3 cm (5’11″) \nWeight: 67 kg (147 lbs) \nBlood Type: B \nMBTI Type: ENFP-T \nNationality: Korean';
  }

  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={styles.backgroundImage}
      blurRadius={5}
    >
      <ScrollView contentContainerStyle={styles.detailsContainer}>
        <Image source={member.image} style={styles.detailImage} />
        <Text style={styles.detailName}>{member.name}</Text>
        <Text style={styles.detailDescription}>{description}</Text>
      </ScrollView>
    </ImageBackground>
  );
};


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerTintColor: '#000',
      }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'TREASURE' }} />
        <Stack.Screen name="MemberDetails" component={MemberDetailsScreen} options={{ title: 'Member Details' }} />
        <Stack.Screen name="VinylScreen" component={VinylScreen} options={{ title: 'Member Playlist' }} />
        <Stack.Screen name="Playlist" component={Playlist} options={{ title: 'Playlist' }} />
        <Stack.Screen name="Player" component={PlayerScreen} options={{ title: 'Player' }} />

        <Stack.Screen name="PlayerScreen" component={PlayerScreen} />

      </Stack.Navigator>

    </NavigationContainer>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  groupImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
    marginTop: 20,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  membersList: {
    paddingBottom: 20,
    paddingTop: 3,
    padding: 35,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    width: 320,
  },
  memberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    resizeMode: 'cover',
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  detailImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  detailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  detailDescription: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'left',
    marginTop: 5,
    lineHeight: 30,
  },
  blurView: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  vinylScreen: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow wrapping to the next row
    justifyContent: 'space-around', // Distribute items evenly
    padding: 20,
    gap: 20, // Add spacing between items
  },
  vinylCard: {
    width: '45%', // Adjust width to fit two cards per row
    aspectRatio: 1, // Maintain square shape
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    height: '50%',
  },
  vinylIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vinylDisc: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3B4144',
    justifyContent: 'center',
    alignItems: 'center',

  },
  vinylCenter: {
    width: 20,
    height: 20,
    borderRadius: 25,
    backgroundColor: '#fff',
    position: 'absolute',
    borderWidth: 2, // Set the width of the border
    borderColor: '#000', // Set the color of the border (e.g., orange)
  },

  vinylImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'absolute',
  },
  outerBorder: {
    width: 90, // Adjust size as needed
    height: 90,
    borderRadius: 45, // Makes it circular
    borderWidth: 5, // Outer border thickness
    borderColor: 'black', // Outer border color
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Ensures the vinyl stays circular
  },
  vinyl: {
    width: 140, // Inner vinyl size (slightly smaller than the border)
    height: 140,
    borderRadius: 70, // Makes it circular
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;