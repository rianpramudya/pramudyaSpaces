'use client';
import type {Entry} from '@/lib/model';
import {projectStageItems} from '@/lib/project-theatre';
import {ProjectTheatre} from './project-theatre';
export function ProjectGallery({projects,en}:{projects:Entry[];en:boolean}){return <ProjectTheatre items={projectStageItems(projects)} en={en}/>;}
