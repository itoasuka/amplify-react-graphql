import "./App.css"
import "@aws-amplify/ui-react/styles.css";
import {API, Storage} from "aws-amplify";
import {Button, Flex, Heading, Image, Text, TextField, View, withAuthenticator,} from "@aws-amplify/ui-react";
import {listNotes, helloWorld} from "./graphql/queries";
import React, {useEffect, useState} from "react";
import {createNote as createNoteMutation, deleteNote as deleteNoteMutation,} from "./graphql/mutations";


function App({signOut, user}) {
    const [notes, setNotes] = useState([]);
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        fetchNotes();
    }, []);

    async function fetchNotes() {
        const token = user.getSignInUserSession().idToken.getJwtToken();
        const myInit = {
            Authorization: token
        }

        const apiData = await API.graphql({query: listNotes}, myInit);
        const notesFromAPI = apiData.data.listNotes.items;
        await Promise.all(
            notesFromAPI.map(async (note) => {
                if (note.image) {
                    note.image = await Storage.get(note.name);
                }
            })
        )
        setNotes(notesFromAPI)

        const greetingData = await API.graphql({query: helloWorld}, myInit);
        setGreeting(greetingData.data.helloWorld.body);
    }

    async function createNote(event) {
        event.preventDefault();

        const form = new FormData(event.target);
        const image = form.get("image")
        const data = {
            name: form.get("name"),
            description: form.get("description"),
            image: image.name
        };
        if (!!data.image) await Storage.put(data.name, image);
        await API.graphql({
            query: createNoteMutation,
            variables: {input: data}
        });
        fetchNotes();
        event.target.reset();
    }

    async function deleteNote({id, name}) {
        const newNotes = notes.filter((note) => note.id !== id);
        setNotes(newNotes);
        await Storage.remove(name);
        await API.graphql({
            query: deleteNoteMutation,
            variables: {input: {id}}
        })
    }

    return (
        <View className="App">
            <Heading level={1}>My Notes App</Heading>
            <p>{greeting}</p>
            <View as="form" margin="3rem 0" onSubmit={createNote}>
                <Flex direction="row" justifyContent="center">
                    <TextField
                        name="name"
                        placeholder="Note Name"
                        label="Note Name"
                        labelHidden
                        variation="quiet"
                        required
                    />
                    <TextField
                        name="description"
                        placeholder="Note Description"
                        label="Note Description"
                        labelHidden
                        variation="quiet"
                        required
                    />
                    <View
                        name="image"
                        as="input"
                        type="file"
                        style={{alignSelf: "end"}}
                    />
                    <Button type="submit" variation="primary">
                        Create Note
                    </Button>
                </Flex>
            </View>
            <Heading level={2}>Current Notes</Heading>
            <View margin="3rem 0">
                {notes.map((note) => (
                    <Flex
                        key={note.id || note.name}
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Text as="strong" fontWeight={700}>
                            {note.name}
                        </Text>
                        <Text as="span">{note.description}</Text>
                        {note.image && (
                            <Image
                                src={note.image}
                                alt={`visual aid for ${notes.name}`}
                                style={{width: 400}}
                            />
                        )}
                        <Button variation="link" onClick={() => deleteNote(note)}>
                            Delete note
                        </Button>
                    </Flex>
                ))}
            </View>
            <Button onClick={signOut}>Sign Out</Button>
        </View>
    );
}

export default withAuthenticator(App);
