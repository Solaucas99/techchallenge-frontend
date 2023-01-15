export type Offline_DB = {
  create_or_update: (data: any) => any;
  read_by_id: <T>(id: string) => Promise<T>;
  read_by_index: (
    index_name: string,
    query_attributes: string | string[]
  ) => any;
  delete_by_id: (id: string) => any;
  read_all: () => Promise<any>;
};

export function database(db_name: string, table_name: string): Offline_DB {
  const indDB = window.indexedDB;

  const create_or_update = (data: any) => {
    const request = indDB.open(db_name, 1);
    let request_result;

    request.onerror = ev => {
      console.error(ev);
    };

    request.onupgradeneeded = () => {
      const db = request.result;

      db.createObjectStore('quiz_challenges', {
        keyPath: 'id',
        autoIncrement: true,
      });

      db.createObjectStore('quiz_questions', {
        keyPath: 'id',
        autoIncrement: true,
      });

      db.createObjectStore('code_complete_challenges', {
        keyPath: 'id',
        autoIncrement: true,
      });

      db.createObjectStore('js_challenges', {
        keyPath: 'id',
        autoIncrement: true,
      });

      db.createObjectStore('js_solutions', {
        keyPath: 'id',
        autoIncrement: true,
      });

      db.createObjectStore('html_challenges', {
        keyPath: 'id',
        autoIncrement: true,
      });

      db.createObjectStore('html_solutions', {
        keyPath: 'id',
        autoIncrement: true,
      });
    };

    request.onsuccess = () => {
      const db = request.result;

      const transaction = db.transaction([table_name], 'readwrite');
      const store = transaction.objectStore(table_name);

      const creation = store.put(data);

      creation.onsuccess = () => {
        db.close();
        request_result = creation.result;
      };
    };

    return request_result;
  };

  const read_by_id = <T>(id: string) =>
    new Promise<T>((resolve, reject) => {
      const request = indDB.open(db_name, 1);

      request.onerror = ev => {
        reject(ev);
      };

      request.onupgradeneeded = () => {
        const db = request.result;

        db.createObjectStore('quiz_challenges', {
          keyPath: 'id',
          autoIncrement: true,
        });

        db.createObjectStore('quiz_questions', {
          keyPath: 'id',
          autoIncrement: true,
        });

        db.createObjectStore('code_complete_challenges', {
          keyPath: 'id',
          autoIncrement: true,
        });

        db.createObjectStore('js_challenges', {
          keyPath: 'id',
          autoIncrement: true,
        });

        db.createObjectStore('js_solutions', {
          keyPath: 'id',
          autoIncrement: true,
        });

        db.createObjectStore('html_challenges', {
          keyPath: 'id',
          autoIncrement: true,
        });

        db.createObjectStore('html_solutions', {
          keyPath: 'id',
          autoIncrement: true,
        });
      };

      request.onsuccess = () => {
        const db = request.result;

        const transaction = db.transaction([table_name], 'readwrite');
        const store = transaction.objectStore(table_name);

        const idQuery = store.get(id);

        idQuery.onsuccess = () => {
          resolve(idQuery.result);
        };
      };
    });

  const delete_by_id = (id: string) => {
    const request = indDB.open(db_name, 1);
    let request_result;

    request.onerror = ev => {
      console.error(ev);
    };

    request.onupgradeneeded = () => {
      const db = request.result;

      db.createObjectStore('quiz_challenges', {
        keyPath: 'id',
        autoIncrement: true,
      });

      db.createObjectStore('quiz_questions', {
        keyPath: 'id',
        autoIncrement: true,
      });

      db.createObjectStore('code_complete_challenges', {
        keyPath: 'id',
        autoIncrement: true,
      });

      db.createObjectStore('js_challenges', {
        keyPath: 'id',
        autoIncrement: true,
      });

      db.createObjectStore('js_solutions', {
        keyPath: 'id',
        autoIncrement: true,
      });

      db.createObjectStore('html_challenges', {
        keyPath: 'id',
        autoIncrement: true,
      });

      db.createObjectStore('html_solutions', {
        keyPath: 'id',
        autoIncrement: true,
      });
    };

    request.onsuccess = () => {
      const db = request.result;

      const transaction = db.transaction([table_name], 'readwrite');
      const store = transaction.objectStore(table_name);

      const idDeletion = store.delete(id);

      idDeletion.onsuccess = () => {
        request_result = idDeletion.result;
      };
    };

    return request_result;
  };

  const read_by_index = (
    index_name: string,
    query_attributes: string | string[]
  ) => {
    const request = indDB.open(db_name, 1);
    let request_result;

    request.onerror = ev => {
      console.error(ev);
    };

    request.onupgradeneeded = () => {
      const db = request.result;

      db.createObjectStore('quiz_challenges', {
        keyPath: 'id',
        autoIncrement: true,
      });

      db.createObjectStore('quiz_questions', {
        keyPath: 'id',
        autoIncrement: true,
      });

      db.createObjectStore('code_complete_challenges', {
        keyPath: 'id',
        autoIncrement: true,
      });

      db.createObjectStore('js_challenges', {
        keyPath: 'id',
        autoIncrement: true,
      });

      db.createObjectStore('js_solutions', {
        keyPath: 'id',
        autoIncrement: true,
      });

      db.createObjectStore('html_challenges', {
        keyPath: 'id',
        autoIncrement: true,
      });

      db.createObjectStore('html_solutions', {
        keyPath: 'id',
        autoIncrement: true,
      });
    };

    request.onsuccess = () => {
      const db = request.result;

      const transaction = db.transaction([table_name], 'readwrite');
      const store = transaction.objectStore(table_name);

      const nameIndex = store.index(index_name);

      const nameQuery = nameIndex.get(query_attributes);

      nameQuery.onsuccess = () => {
        request_result = nameQuery.result;
      };
    };

    return request_result;
  };

  const read_all = () =>
    new Promise<Array<any>>((resolve, reject) => {
      const request = indDB.open(db_name);

      request.onerror = ev => {
        reject(ev);
      };

      request.onupgradeneeded = e => {
        const db = request.result;

        db.createObjectStore('quiz_challenges', {
          keyPath: 'id',
          autoIncrement: true,
        });

        db.createObjectStore('quiz_questions', {
          keyPath: 'id',
          autoIncrement: true,
        });

        db.createObjectStore('code_complete_challenges', {
          keyPath: 'id',
          autoIncrement: true,
        });

        db.createObjectStore('js_challenges', {
          keyPath: 'id',
          autoIncrement: true,
        });

        db.createObjectStore('js_solutions', {
          keyPath: 'id',
          autoIncrement: true,
        });

        db.createObjectStore('html_challenges', {
          keyPath: 'id',
          autoIncrement: true,
        });

        db.createObjectStore('html_solutions', {
          keyPath: 'id',
          autoIncrement: true,
        });
      };

      request.onsuccess = () => {
        const db = request.result;

        const transaction = db.transaction([table_name], 'readwrite');
        const store = transaction.objectStore(table_name);

        const query = store.getAll();

        query.onsuccess = () => {
          resolve(query.result);
        };
      };
    });

  return {
    create_or_update,
    read_by_id,
    read_by_index,
    delete_by_id,
    read_all,
  };
}
