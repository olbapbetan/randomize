import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Chip, Grid, Stack, TextField } from '@mui/material';
import { Add } from '@mui/icons-material';
import Randomizer from './components/Randomizer';
import Minuta from './components/Minuta';

import './App.css';

function App() {
  const [selectMembers, setSelectMembers] = useState([])
  const [members, setMembers] = useState([])
  const [newMember, setNewMember] = useState("")
  const [selectedOption, setSelectedOption] = useState("")

  const navOptions = ["Randomizer", "Notes"]

  useEffect(() => {
    // Function to parse URL parameters and set options if present
    const urlParams = new URLSearchParams(window.location.search);
    const optionsFromUrl = urlParams.get('options');
    if (optionsFromUrl) {
      const newOptions = optionsFromUrl.split(',').map((option) => option.trim());
      setSelectMembers(newOptions);
      setMembers([...selectMembers, ...newOptions]);
    }
  }, []);

  useEffect(() => {
    // Update URL parameters whenever options change
    const urlParams = new URLSearchParams();
    urlParams.set('options', selectMembers.join(','));
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
  }, [selectMembers]);

  const handleAddMember = (event) => {
    const newOption = newMember.trim();
    if (newOption !== '' && !selectMembers.includes(newOption)) {
      setSelectMembers([...selectMembers, newOption]);
      setMembers([...selectMembers, newOption]);
      setNewMember('');
    }
  };

  const handleMemberClick = (e) => {
    const member = e.target.innerHTML
    if (members.includes(member)) {
        setMembers(members.filter((m) => m !== member))
    } else {
        setMembers([...members, member])
    }
  };

  return (
    <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} sx={{rowGap: '24px'}} >
        <Grid sx={{width: "50%"}} container spacing={1}>
          {selectMembers.map((member, index) => (
            <Grid key={index} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} item xs={4}>
              <Chip color="primary" label={member} onClick={handleMemberClick} variant={members.includes(member) ? "" : "outlined"} />
            </Grid>)
          )}
        </Grid>
        <Stack direction={"row"} sx={{columnGap: '24px'}}>
          <TextField size="small" onChange={(e) => setNewMember(e.target.value)} id="outlined-new-member" label="New Member" variant="outlined" value={newMember} />
          <Button sx={{width: "fit-content"}} onClick={handleAddMember} variant="contained" >
            <Add />
          </Button>
        </Stack>
        <ButtonGroup variant="outlined" aria-label="outlined button group">
          {navOptions.map((option) => (
            <Button onClick={(e) => setSelectedOption(e.target.innerText)} >{option}</Button>
          ))}
        </ButtonGroup>
        {
          {
            "RANDOMIZER": <Randomizer paramOptions={members} />,
            "NOTES": <Minuta selectMembers={members} />
          }[selectedOption]
        }
    </Stack>
  );
}

export default App;
