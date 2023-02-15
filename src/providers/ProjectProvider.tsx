import React, { useState, ReactNode, createContext, Dispatch, SetStateAction } from 'react';

type Props = {
  children: ReactNode;
};

const noop = () => {};

export const ProjectContext = createContext({
  projectSelected: '',
  setProject: noop as Dispatch<SetStateAction<string>>,
});

const ProjectProvider = ({ children }: Props) => {
  const [projectSelected, setProject] = useState('');

  return (
    <ProjectContext.Provider value={{
      projectSelected,
      setProject,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;
