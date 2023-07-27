import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopy } from "@fortawesome/free-solid-svg-icons/faCopy"
import SendIcon from '@mui/icons-material/Send';
import { Stack, TextField, MenuItem, Box, Container, Button, Grid, Chip } from "@mui/material"
import { useEffect, useState } from "react"

import TurndownService from "turndown";

export default function Minuta({selectMembers}) {
    const [minuta, setMinuta] = useState({})
    const [name, setName] = useState('')
    const [color, setColor] = useState('')
    const [colorDescription, setColorDescription] = useState('')
    const [work, setWork] = useState('')
    const [members, setMembers] = useState(selectMembers)

    useEffect(() => {
        setMembers(selectMembers)
    }, [selectMembers])

    const colors = [
        {
            value: 'Green',
            label: 'Green',
        },
        {
            value: 'Yellow',
            label: 'Yellow',
        },
        {
            value: 'Red',
            label: 'Red',
        },
        {
            value: 'Blue',
            label: 'Blue',
        },
    ];

    const handleSubmit = () => {
        if (name !== '') {
            let newEnter = {}
            newEnter[name] = {...minuta[name]}
            if (color !== '') {
                newEnter[name]['color'] = color
            }
            if (colorDescription !== '') {
                newEnter[name]['colorDescription'] = colorDescription
            }
            if (work !== '') {
                newEnter[name]['work'] = work
            }

            setMinuta({...minuta, ...newEnter})
        }
        setName('')
        setColor('')
        setColorDescription('')
        setWork('')
    }

    const handleCopy = () => {
        const minutaContainer = document.getElementById('minuta')
        const clipboardTextarea = document.getElementById('clipboard-textarea')

        const minutaContainerContent = minutaContainer.innerHTML

        // Create an instance of the Turndown service
        const turndownService = new TurndownService();

        let minutaMarkdown = turndownService.turndown(minutaContainerContent);
        minutaMarkdown = minutaMarkdown.replaceAll('    *  ', '-')
        minutaMarkdown = minutaMarkdown.replaceAll('**', '*')

        if (!navigator.clipboard){
            clipboardTextarea.value = minutaMarkdown
            clipboardTextarea.select()

            document.execCommand('copy')

            document.getElementById("copy-btn").innerText = "Copied"
    
            window.getSelection().removeAllRanges();
        } else{
            navigator.clipboard.writeText(minutaMarkdown).then(
                function(){
                    document.getElementById("copy-btn").innerText = "Copied"; // success
                    document.getElementById("copy-btn").style.border = '1px solid rgba(46, 125, 50, 0.5)';
                    document.getElementById("copy-btn").style.color = '#2e7d32';
                })
              .catch(
                 function() {
                    alert("err"); // error
              });
        }
    }

    return (
        <Container sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: '24px'}}>
            <Stack sx={{width: "50%"}} direction="column" useFlexGap justifyContent="center" alignItems="center" spacing={{ xs: 3 }}>
                <TextField onChange={(e) => setName(e.target.value)} value={name} fullWidth={true} id="outlined-select-name" label="Name" select defaultValue="" variant="outlined" >
                    {members.map((option, index) => (
                        <MenuItem key={index} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <Stack spacing={5} direction="row" width={"100%"} justifyContent={'space-between'}>
                    <TextField
                        id="outlined-select-color"
                        label="Select"
                        defaultValue="Green"
                        select
                        sx={{width: '50%'}}
                        onChange={(e) => setColor(e.target.value)}
                        value={color}
                    >
                        {colors.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField onChange={(e) => setColorDescription(e.target.value)} value={colorDescription} id="outlined-color-description" label="Color" variant="outlined" />
                </Stack>
                <TextField onChange={(e) => setWork(e.target.value)} value={work} fullWidth={true} id="outlined-work" label="Work" multiline variant="outlined" />
                <Button onClick={handleSubmit} variant="contained" endIcon={<SendIcon />}>
                    Send
                </Button>
            </Stack>
            <Stack sx={{width: "50%"}} direction="row" useFlexGap justifyContent="space-between">
                <Container>
                    <div style={{fontFamily: "Roboto"}} id="minuta">
                        <ol>
                            {Object.keys(minuta).map((key) => (
                                <li>
                                    <strong>{key}</strong> - Color: {minuta[key].color}
                                    <ul>
                                        <li><strong>Feeling and details:</strong> {minuta[key].colorDescription}</li>
                                        <li>
                                            <strong>Task and Project:</strong>
                                            <ul>
                                                <li>
                                                    <strong>Progress and details:</strong>
                                                    <ul>
                                                        {minuta[key].work?.split('\n').map((item) => (
                                                            <li>{item}</li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                            ))}
                        </ol>
                    </div>
                    <textarea id="clipboard-textarea" style={{position: 'absolute', top: '-9999px', left: '-9999px'}}></textarea>
                </Container>
                <Button id="copy-btn" onClick={handleCopy} sx={{color: "black", borderColor: "black", height: "30px"}} variant="outlined" startIcon={<FontAwesomeIcon icon={faCopy} />} >
                    Copy
                </Button>
            </Stack>
        </Container>
    )
}