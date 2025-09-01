import { TouchableOpacity, View, Button, StyleSheet } from "react-native"
import Accordion from '../elements/Accordion'
import UserProfile from './UserProfile'
import UserFantasyBoard from './UserFantasyBoard'
import UserImages from './UserImages'
import { useState } from "react"
import Graphics from "./Graphics"
import { Text } from "react-native"
import Header from './Header'
import PrivacyInfo from './Privacy'
import About from './About'

export default function HomePage({user, partner, setSession}){

    const [selectedComponent, setSelectedComponent] = useState(null);

    const pages = [
        {name: 'You', component: 
            <View style={{marginLeft: 0}}> 
                <TouchableOpacity
                    style={styles.customButton}
                    title="Profile"
                    onPress={() =>
                        setSelectedComponent(() => () => (
                        <UserProfile user={user} setSelectedOption={() => setSelectedComponent(null)} />
                        ))
                    }
                >
                    <Text style={styles.buttonText}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.customButton}
                    title="Fantasy Board"
                    onPress={() =>
                        setSelectedComponent(() => () => (
                        <UserFantasyBoard user={user} setSelectedOption={() => setSelectedComponent(null)} />
                        ))
                    }
                >
                    <Text style={styles.buttonText}>Fantasy Board</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.customButton}
                    title="Image Manager"
                    onPress={() =>
                        setSelectedComponent(() => () => (
                        <UserImages user={user} setSelectedOption={() => setSelectedComponent(null)} />
                        ))
                    }
                >
                    <Text style={styles.buttonText}>Images</Text>
                </TouchableOpacity>
            </View>
        }, {name: 'Them', component: 
            <View style={{marginLeft: 0}}> 
                <TouchableOpacity
                style={styles.customButton}
                    title="Profile"
                    onPress={() =>
                        setSelectedComponent(() => () => (
                        <UserProfile user={partner} setSelectedOption={() => setSelectedComponent(null)} />
                        ))
                    }
                >
                    <Text style={styles.buttonText}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.customButton}
                    title="Fantasy Board" 
                    onPress={() =>
                        setSelectedComponent(() => () => (
                        <UserFantasyBoard user={partner} setSelectedOption={() => setSelectedComponent(null)} />
                        ))
                    }
                >
                    <Text style={styles.buttonText}>Fantasy Board</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.customButton}
                    title="Image Manager"
                    onPress={() =>
                        setSelectedComponent(() => () => (
                        <UserImages user={partner} setSelectedOption={() => setSelectedComponent(null)} />
                        ))
                    }
                >
                    <Text style={styles.buttonText}>Images</Text>
                </TouchableOpacity>
            </View>
        }, {name: 'Us', component: 
            <View style={{marginLeft: 0}}> 
                <TouchableOpacity
                    style={styles.customButton}
                    onPress={() =>
                        setSelectedComponent(() => () => (
                        <About user={partner} setSelectedOption={() => setSelectedComponent(null)} />
                        ))
                    }
                >
                    <Text style={styles.buttonText}>About</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.customButton}
                    onPress={() =>
                        setSelectedComponent(() => () => (
                        <PrivacyInfo user={partner} setSelectedOption={() => setSelectedComponent(null)} />
                        ))
                    }
                >
                    <Text style={styles.buttonText}>Privacy</Text>
                </TouchableOpacity>
            </View>
        }
    ]

    return (
        <View title='homepage' style={{justifyContent: 'flex-start', height: '90%', paddingTop: 50, width: '100%', backgroundColor: 'black', alignItems: 'center'}}>
            <View style={{height: '8%', justifyContent: 'center', width: '100%'}}>
                <Header setSelectedComponent={setSelectedComponent} setSession={setSession}/>
            </View>
            {!selectedComponent && 
            <View style={{ marginBottom: 20, width: '70%', height: '50%', justifyContent: 'center', backgroundColor: 'whitesmoke'}}>
                <Graphics />
            </View>}
            {selectedComponent ? selectedComponent() : (
            <View style={{width: '100%', height: '100%', paddingLeft: 20, backgroundColor: 'whitesmoke'}}>
                {pages.map((p) => (
                    <Accordion key={p.name} title={p.name} content={p.component} fs={40} />
                ))}
            </View>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
  customButton: {
    backgroundColor: 'skyblue',
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
    width: '80%',shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});