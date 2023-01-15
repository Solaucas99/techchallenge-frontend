import React, { useCallback, useEffect, useRef, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/material';
import { MdAddCircle, MdDelete, MdHome, MdPlayArrow } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BiCategory } from 'react-icons/bi';
import { styled } from '../../../../Styles/stitches.config';
import { ContainerContent } from '../../../../Components/Useful/ContainerContent';
import { PageTitleH1 } from '../../../../Components/Useful/PageTitleH1';
import { instanceAPI } from '../../../../Utils/axios';
import {
  IAxiosDelete,
  IAxiosGet,
} from '../../../../Types/interfaces/IAxiosRequests';
import { useUserContextProvider } from '../../../../Providers/UserContextProvider';
import { Container } from '../../../../Components/Useful/Container';
import { useAppContextProvider } from '../../../../Providers/AppContextProvider';
import { IHTML_Challenge } from '../../../../Types/entities/IHTML_Challenge';
import PopupDialog from '../../../../Components/PopupDialog';
import Breadcrumbs from '../../../../Components/Breadcrumbs';

interface Column {
  id: 'title' | 'instruction' | 'pontuation' | 'difficulty';
  label: string;
  minWidth?: number;
  align?: 'right' | 'center';
}

const columns: readonly Column[] = [
  { id: 'title', label: 'Nome do desafio', minWidth: 170 },
  { id: 'instruction', label: 'Instruções', minWidth: 100 },
  {
    id: 'pontuation',
    label: 'Pontuação',
    minWidth: 170,
    align: 'center',
  },
];

const StyledLink = styled(Link, {
  fontWeight: 'bold',
  color: 'inherit',
  fontSize: '1.2em',
  textDecoration: 'none',
  transition: 'all 0.2s ease-in-out',

  '&:hover': {
    color: '#89CFF0',
  },
});

function HTMLChallengesListIndex() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<IHTML_Challenge[]>([]);

  const { userContext } = useUserContextProvider();
  const { setAppContext } = useAppContextProvider();

  const [deletionDialogOpen, setDeletionDialogOpen] = useState<boolean>(false);
  const challengeId = useRef<string>('');

  const navigate = useNavigate();

  const breadcrumbsPrevPages = [
    { title: 'Home', icon: <MdHome />, to: '/' },
    {
      title: 'Categorias',
      icon: <BiCategory />,
      to: '/challenges/categories',
    },
  ];

  const handleRemotionClick = (id: string) => {
    challengeId.current = id;
    setDeletionDialogOpen(true);
  };

  const handleClose = () => {
    setDeletionDialogOpen(false);
  };

  const remotionCallback = useCallback(
    async (value: boolean) => {
      if (value) {
        try {
          setAppContext(prevContext => ({ ...prevContext, isLoading: true }));
          const removedChallenge = await instanceAPI.delete<
            IAxiosDelete<IHTML_Challenge>
          >(`/challenges/html/delete/${challengeId.current}`);

          if (!removedChallenge.data.result.id) {
            toast.error(
              'Erro desconhecido ao remover o desafio. Tente novamente mais tarde'
            );
            return;
          }

          setAppContext(prevContext => ({
            ...prevContext,
            isLoading: false,
          }));

          toast.success('Desafio removido com sucesso!');

          setTimeout(() => {
            navigate(0);
          }, 1000);
        } catch (err) {
          setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
          if (err.response?.data?.error) {
            toast.error(err.response.data.error);
          } else {
            toast.error('Erro inesperado! Tente novamente mais tarde');
          }
        }

        handleClose();
        return;
      }

      handleClose();
    },
    [setAppContext, navigate]
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setAppContext(prevContext => ({ ...prevContext, isLoading: true }));

        if (userContext.is_admin) {
          const { data } = await instanceAPI.get<IAxiosGet<IHTML_Challenge[]>>(
            `/challenges/html/`
          );

          setRows(prevValue => [...prevValue, ...data.result]);
          setAppContext(prevContext => ({ ...prevContext, isLoading: false }));
          return;
        }

        const { data } = await instanceAPI.get<IAxiosGet<IHTML_Challenge[]>>(
          `/challenges/html/uncompleted/${userContext.id}`
        );

        setRows(prevValue => [...prevValue, ...data.result]);
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

    fetchData();
  }, [setAppContext, userContext.id, userContext.is_admin]);

  return (
    <Container>
      <Breadcrumbs
        prevPages={breadcrumbsPrevPages}
        actualPage={{
          title: 'HTML (Dom)',
        }}
      />
      <ContainerContent>
        <PageTitleH1>Desafios HTML (DOM)</PageTitleH1>
        <Paper sx={{ width: '90%', height: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 350 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map(column => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}

                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(row => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map(column => {
                        const value = row[column.id];

                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === 'title' ? (
                              <StyledLink to={row.id}>{value}</StyledLink>
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}

                      <TableCell
                        align="center"
                        style={{
                          minHeight: 120,
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'space-around',
                          alignItems: 'center',
                        }}
                      >
                        <Link
                          style={{ color: 'inherit', textDecoration: 'none' }}
                          to={row.id}
                        >
                          <Button
                            variant="outlined"
                            color="success"
                            type="button"
                            startIcon={<MdPlayArrow />}
                            sx={{ width: '120px' }}
                          >
                            Iniciar
                          </Button>
                        </Link>
                        {userContext.is_admin && (
                          <Button
                            variant="outlined"
                            color="error"
                            type="button"
                            startIcon={<MdDelete />}
                            onClick={() => handleRemotionClick(row.id)}
                            sx={{ width: '120px' }}
                          >
                            Remover
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        {userContext.is_admin && (
          <Link
            style={{ color: 'inherit', textDecoration: 'none' }}
            to="/admin/challenges/categories/html/create"
          >
            <Button
              variant="outlined"
              type="button"
              startIcon={<MdAddCircle />}
            >
              Criar desafio
            </Button>
          </Link>
        )}
      </ContainerContent>

      {deletionDialogOpen && (
        <PopupDialog
          title="Tem certeza que você quer remover esse desafio?"
          message="Ao clicar em concordo, todos os dados relacionados ao desafio selecionado serão removidos e apagados. A ação será irreversível."
          callback={remotionCallback}
        />
      )}
    </Container>
  );
}

export default HTMLChallengesListIndex;
