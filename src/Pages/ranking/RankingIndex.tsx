import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { toast } from 'react-toastify';
import { Container } from '../../Components/Useful/Container';
import { ContainerContent } from '../../Components/Useful/ContainerContent';
import { PageTitleH1 } from '../../Components/Useful/PageTitleH1';
import RankingUI from '../../Components/Ranking/RankingUI';
import { instanceAPI } from '../../Utils/axios';
import { IAxiosGet } from '../../Types/interfaces/IAxiosRequests';
import { IRanking } from '../../Types/entities/IRanking';
import { useAppContextProvider } from '../../Providers/AppContextProvider';

function RankingIndex() {
  const [tab, setTab] = useState<string>('js');

  const [ranking, setRanking] = useState<IRanking[]>([]);

  const [quarter, setQuarter] = useState<string>('4');

  const { setAppContext } = useAppContextProvider();

  const handleTabChange = (
    event: React.SyntheticEvent,
    ranking_type: string
  ) => {
    setTab(ranking_type);
  };

  const handleQuarterChange = (e: SelectChangeEvent) => {
    setQuarter(e.target.value);
  };

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setAppContext(prevContext => ({ ...prevContext, isLoading: true }));
        const { data } = await instanceAPI.get<IAxiosGet<IRanking[]>>(
          `/ranking?quarter=${quarter}&ranking_type=${tab}`
        );

        setRanking(data.result);
        setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
      } catch (err) {
        setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
        if (err.response?.data?.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error('Erro inesperado! Tente novamente mais tarde');
        }
      }
    };

    fetchRanking();
  }, [quarter, tab, setAppContext]);

  return (
    <Container>
      <ContainerContent>
        <PageTitleH1>Ranking</PageTitleH1>
        <Box sx={{ minWidth: 120, position: 'absolute', top: 200, right: 150 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Quarter</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={quarter}
              label="Quarter"
              onChange={handleQuarterChange}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <TabContext value={tab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              onChange={handleTabChange}
              aria-label="lab API tabs example"
            >
              <Tab sx={{ color: 'white' }} label="JavaScript" value="js" />
              <Tab sx={{ color: 'white' }} label="HTML" value="html" />
              <Tab sx={{ color: 'white' }} label="Quiz" value="quiz" />
              <Tab
                sx={{ color: 'white' }}
                label="Code Complete"
                value="code_complete"
              />
            </TabList>
          </Box>

          <TabPanel sx={{ width: '100%', height: '100%' }} value="js">
            {ranking.length >= 3 ? (
              <RankingUI ranking={ranking} />
            ) : (
              'Ranking incompleto até o momento'
            )}
          </TabPanel>

          <TabPanel sx={{ width: '100%', height: '100%' }} value="html">
            {ranking.length >= 3 ? (
              <RankingUI ranking={ranking} />
            ) : (
              'Ranking incompleto até o momento'
            )}
          </TabPanel>

          <TabPanel sx={{ width: '100%', height: '100%' }} value="quiz">
            {ranking.length >= 3 ? (
              <RankingUI ranking={ranking} />
            ) : (
              'Ranking incompleto até o momento'
            )}
          </TabPanel>

          <TabPanel
            sx={{ width: '100%', height: '100%' }}
            value="code_complete"
          >
            {ranking.length >= 3 ? (
              <RankingUI ranking={ranking} />
            ) : (
              'Ranking incompleto até o momento'
            )}
          </TabPanel>
        </TabContext>
      </ContainerContent>
    </Container>
  );
}

export default RankingIndex;
