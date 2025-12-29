/* 
"StAuth10244: I Serhii Ivanchuk, 000818168 certify that this material is my original work. 
 No other person's work has been used without due acknowledgement. 
 I have not made my work available to anyone else."



The Web API used in the assignment is from "openlibrary" - https://openlibrary.org/developers/api


*/


import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import {  Image,  TextInput } from 'react-native';
import { Button, TouchableHighlight, Pressable , FlatList, ActivityIndicator } from 'react-native';
import { Keyboard } from 'react-native'
import { LinearGradient } from "expo-linear-gradient";
export default function App() {
  


  const [text, setText] = useState('');
  const [booksData, setBooksData] = useState([]);
  const [isLoadingData, setLoadingData] = useState(true);
  const [isAuthor, setIsAuthor] = useState(false);
    

    const clearData = () => {
        setBooksData([]);
      };

    
    const handleAuthorSelection = () => {
      setIsAuthor(true);
      clearData();
      setText("");
    };
    
    const handleReaderSelection = () => {
      setIsAuthor(false);
      clearData();
      setText("");
    };


    const searchBooks = async (value, author) => {
      try {
        clearData();
        setLoadingData(true);
        Keyboard.dismiss();

        var param = 'https://openlibrary.org/search.json?q=' + value;
        if (author == true)  
          param = 'https://openlibrary.org/search.json?author=' + value + '&sort=new';
        
        
        const response = await fetch(param);
        const json = await response.json();

        setBooksData(json.docs);

      } catch (error) {
        console.error(error);
        setBooksData([]);
      } finally {
        setLoadingData(false);
      }
    }



    useEffect(() => {
      setText("Harry");
      searchBooks("Harry", false);
    }, []);


    //console.log(booksData);


    const DisplayLoading = () => {
      return (
        <View style = {{flexDirection: 'column', justifyContent: 'center', alignItems:'center', marginTop: 50}}>
          <Text>Searching... </Text>
          <ActivityIndicator size="large"/>
      </View>);
    }


  return (
  <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#434343', '#909090']}>

    <View style = {{borderBottomWidth: 5, borderBottomColor: '#d8d8d8'}}>
      <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#e2e2e2', '#9f9f9f']} style={styles.container}>
        <Text style = {{backgroundColor:'#77baff',  padding: 2, paddingLeft: 8, paddingRight: 8, borderRadius: 5}}><Text style ={styles.blueChar} >Book</Text> Finder</Text>
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Books_and_Scroll_Ornament_with_Open_Book.png',
          }}
          style={{ width: 200, height: 100 }}
          resizeMode="cover"
        />
      </LinearGradient>
     

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput style={styles.searchInput}
            value = {text}
            onChangeText = { text => setText(text) }
            placeholder= {isAuthor? "Enter Author Name":"Enter Book Title"}
          />

          <Pressable style ={{alignContent:'center', justifyContent:'center',  borderRadius:5, height: 40, width: 100, marginLeft :5, marginRight:5,borderColor: 'white', borderWidth:2, backgroundColor:'#00a0ff'}}>
             
              <Text style={{color:'white',textAlign: 'center'}} onPress={()=>  searchBooks(text, isAuthor)}>Search</Text>
          </Pressable> 
      </View>
      
      <View style = {{ flexDirection: 'row', borderRadius:5, backgroundColor:'#e2e2e2', margin: 10, padding: 10,}}>
        <Pressable style = {{width: 150}}  onPress={handleReaderSelection}>
          <Text style={[styles.centeredText,styles.underlinedTextDisabled, !isAuthor && styles.underlinedText]}>Book Title</Text>
        </Pressable>    
        <Pressable style = {{width: 150}}  onPress={handleAuthorSelection}>
          <Text style={[styles.centeredText, styles.underlinedTextDisabled, isAuthor && styles.underlinedText]}>Author Name</Text>
        </Pressable>
      </View>
    </View>
      {isLoadingData ? <DisplayLoading/> : (
          <FlatList style = {{marginBottom: 310}}
            data={booksData}
            keyExtractor={({ key }, index) => key}
            renderItem={({ item }) => (
              <LinearGradient colors={['#c3c3c3', '#909090']} style = {[styles.itemStyle, styles.shadowStyle]}>

                  <Image source={{ uri: `https://covers.openlibrary.org/b/olid/${item.cover_edition_key}-M.jpg`,}}
                    style={{ width: 96, height: 128 }}
                    resizeMode="contain"
                  />

                  <View  style = {{flexDirection: 'column', marginLeft: 10, flexShrink: 1}}  >
                      <Text><Text style = {styles.boldText}>Title:</Text> {item.title}</Text>
                      
                      { (item.author_name && item.author_name.length > 0) && (item.author_key && item.author_key.length > 0) && (
                        <Text><Text style = {styles.boldText}>Author:</Text><Text style={{color: 'blue',  marginLeft: 6}}  onPress={()=>  searchBooks(item.author_key[0], true)}> {item.author_name[0]}</Text> </Text>
                      )}

                      {item.publish_date && item.publish_date.length > 0 && (
                        <Text><Text style = {styles.boldText}>Published:</Text> {item.publish_date[0]}</Text>
                      )}

                      {item.language && item.language.length > 0 && (
                        <Text><Text style = {styles.boldText}>Language:</Text> {item.language.join(", ")}</Text>
                      )}               
                      
                      {item.isbn && item.isbn.length > 0 && (
                        <Text><Text style = {styles.boldText}>ISBN:</Text> {item.isbn[0]}</Text>
                      )}
                  </View>

              </LinearGradient>
            )}
          />

      )}

      <StatusBar style="auto" />
    </LinearGradient>


  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginBottom: 10,
    height: 150,
    backgroundColor:'#c5c5c5',
    alignItems: 'center',
    justifyContent: 'center',
    
  },




  containerTransparent: {
    marginTop: 30,
    height: 150,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput:{
    flex: 1,
    borderWidth: 2,
    height: 40,
    borderColor: 'white',
    borderRadius: 10,
    marginLeft: 5,
    marginRight: 5,
    paddingLeft: 20,
    backgroundColor:'#e2e2e2'
  },

  underlinedText:{
    borderBottomColor: '#11a7ff',
      borderBottomWidth: 4,
      paddingBottom: 5,
      fontWeight:'bold'
  },

  underlinedTextDisabled:{
    borderBottomColor: '#525252',
      borderBottomWidth: 4,
      paddingBottom: 5,
  },

  centeredText:{
    textAlign: 'center',
    marginLeft: 10
  }
  ,
  blueChar:{
    fontWeight:'bold',
    color:'#ffffff'
  },

  boldText:{
    fontWeight:'bold',
    color:'black'
  },
  shadowStyle: {
    shadowColor: '#171717',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  itemStyle:{
    shadowColor: 'black', flexDirection: 'row', borderColor: '#ffffff', borderRadius: 5, margin: 10, padding: 10, backgroundColor:'#daf6ff', borderWidth: 2,
  }




});
